const MealLog = require('../models/MealLog');
const MealItem = require('../models/MealItem');
const Food = require('../models/Food');
const NutritionGoal = require('../models/NutritionGoal');
const ApiError = require('../utils/ApiError');

// ============================================================
// Helper — build start/end of a day in UTC
// ============================================================
const dayRange = (dateStr) => {
  const date = dateStr ? new Date(dateStr) : new Date();
  if (isNaN(date)) throw new ApiError(400, 'Invalid date format. Use YYYY-MM-DD.');
  const start = new Date(date);
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setUTCHours(23, 59, 59, 999);
  return { start, end };
};

// ============================================================
// GET /api/meal-logs?date=2026-05-17
// Returns all meal logs for the day with their items populated
// ============================================================
exports.getDailyLogs = async (req, res, next) => {
  try {
    const { start, end } = dayRange(req.query.date);

    const logs = await MealLog.find({
      userId: req.user._id,
      date: { $gte: start, $lte: end },
    }).sort({ mealType: 1 });

    // Populate items for each log
    const logsWithItems = await Promise.all(
      logs.map(async (log) => {
        const items = await MealItem.find({ mealLogId: log._id }).populate(
          'foodId',
          'name caloriesPerServing proteinG carbsG fatG servingSize servingUnit'
        );
        return { ...log.toObject(), items };
      })
    );

    res.status(200).json({ success: true, data: logsWithItems });
  } catch (err) {
    next(err);
  }
};

// ============================================================
// GET /api/meal-logs/summary?date=2026-05-17
// Daily totals: calories consumed vs goal, macros
// ============================================================
exports.getDailySummary = async (req, res, next) => {
  try {
    const { start, end } = dayRange(req.query.date);

    const logs = await MealLog.find({
      userId: req.user._id,
      date: { $gte: start, $lte: end },
    });

    const logIds = logs.map((l) => l._id);
    const items = await MealItem.find({ mealLogId: { $in: logIds } });

    const consumed = items.reduce(
      (acc, item) => {
        acc.calories += item.calories || 0;
        acc.proteinG += item.proteinG || 0;
        acc.carbsG += item.carbsG || 0;
        acc.fatG += item.fatG || 0;
        return acc;
      },
      { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 }
    );

    // Round all values
    Object.keys(consumed).forEach((k) => {
      consumed[k] = Math.round(consumed[k] * 10) / 10;
    });

    const goal = await NutritionGoal.findOne({ userId: req.user._id });

    res.status(200).json({
      success: true,
      data: {
        date: req.query.date || new Date().toISOString().split('T')[0],
        consumed,
        goal: goal
          ? {
              calories: goal.calorieGoal,
              proteinG: goal.proteinGoalG,
              carbsG: goal.carbsGoalG,
              fatG: goal.fatGoalG,
            }
          : null,
        remaining: goal
          ? {
              calories: Math.max(0, goal.calorieGoal - consumed.calories),
              proteinG: Math.max(0, goal.proteinGoalG - consumed.proteinG),
              carbsG: Math.max(0, goal.carbsGoalG - consumed.carbsG),
              fatG: Math.max(0, goal.fatGoalG - consumed.fatG),
            }
          : null,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ============================================================
// POST /api/meal-logs
// Create or retrieve a meal log for a given date + mealType
// ============================================================
exports.createOrGetMealLog = async (req, res, next) => {
  try {
    const { date, mealType } = req.body;
    if (!date || !mealType) throw new ApiError(400, 'date and mealType are required.');

    const { start, end } = dayRange(date);

    let log = await MealLog.findOne({
      userId: req.user._id,
      date: { $gte: start, $lte: end },
      mealType,
    });

    if (!log) {
      log = await MealLog.create({
        userId: req.user._id,
        date: new Date(date),
        mealType,
      });
    }

    res.status(200).json({ success: true, data: log });
  } catch (err) {
    next(err);
  }
};

// ============================================================
// POST /api/meal-logs/:id/items
// Add a food item to a meal log
// Body: { foodId, quantity }  — quantity is in servings
// ============================================================
exports.addItemToMeal = async (req, res, next) => {
  try {
    const { foodId, quantity } = req.body;
    if (!foodId || !quantity) throw new ApiError(400, 'foodId and quantity are required.');

    // Verify the meal log belongs to this user
    const log = await MealLog.findOne({ _id: req.params.id, userId: req.user._id });
    if (!log) throw new ApiError(404, 'Meal log not found.');

    const food = await Food.findById(foodId);
    if (!food) throw new ApiError(404, 'Food not found.');

    // Calculate nutrition based on quantity (each unit = 1 serving)
    const factor = quantity;
    const item = await MealItem.create({
      mealLogId: log._id,
      foodId: food._id,
      quantity,
      calories: Math.round(food.caloriesPerServing * factor * 10) / 10,
      proteinG: Math.round(food.proteinG * factor * 10) / 10,
      carbsG: Math.round(food.carbsG * factor * 10) / 10,
      fatG: Math.round(food.fatG * factor * 10) / 10,
    });

    await item.populate('foodId', 'name caloriesPerServing servingSize servingUnit');

    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

// ============================================================
// DELETE /api/meal-logs/:mealLogId/items/:itemId
// ============================================================
exports.removeItemFromMeal = async (req, res, next) => {
  try {
    const log = await MealLog.findOne({ _id: req.params.mealLogId, userId: req.user._id });
    if (!log) throw new ApiError(404, 'Meal log not found.');

    const item = await MealItem.findOneAndDelete({
      _id: req.params.itemId,
      mealLogId: log._id,
    });

    if (!item) throw new ApiError(404, 'Meal item not found.');

    res.status(200).json({ success: true, message: 'Item removed from meal.' });
  } catch (err) {
    next(err);
  }
};
