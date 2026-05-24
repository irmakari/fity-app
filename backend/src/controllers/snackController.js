const ApiError = require('../utils/ApiError');
const User = require('../models/User');
const MealLog = require('../models/MealLog');
const MealItem = require('../models/MealItem');
const Food = require('../models/Food');
const { suggestSnack } = require('../ai/snackAI');

/**
 * @desc    Suggest a smart snack based on user's remaining calories
 * @route   POST /api/snack/suggest
 * @access  Private
 */
exports.suggestSnack = async (req, res, next) => {
  try {
    const { preference, date } = req.body;
    const targetDate = date || new Date().toISOString().split('T')[0];

    // 1. Get user to check goals
    const user = await User.findById(req.user.id);
    const dailyGoal = user.nutritionGoal?.calories || 2000;

    // 2. Calculate consumed calories for the given date
    const start = new Date(targetDate);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(targetDate);
    end.setUTCHours(23, 59, 59, 999);

    const mealLogs = await MealLog.find({ userId: req.user.id, date: { $gte: start, $lte: end } });
    const logIds = mealLogs.map((log) => log._id);
    const items = await MealItem.find({ mealLogId: { $in: logIds } });

    let consumedCalories = 0;
    items.forEach((item) => {
      consumedCalories += item.calories || 0;
    });

    // 3. Calculate remaining calories
    const remainingCalories = dailyGoal - consumedCalories;

    // 4. Generate AI Suggestion
    const aiSuggestion = await suggestSnack(remainingCalories, preference);

    // 5. Save the suggested food to DB so user can add it easily
    const savedFood = await Food.create({
      name: aiSuggestion.name,
      caloriesPerServing: aiSuggestion.caloriesPerServing,
      proteinG: aiSuggestion.proteinG,
      carbsG: aiSuggestion.carbsG,
      fatG: aiSuggestion.fatG,
      servingSize: aiSuggestion.servingSize,
      servingUnit: aiSuggestion.servingUnit || 'porsiyon',
      source: 'ai', // Mark as AI generated
    });

    res.status(200).json({
      success: true,
      data: {
        recipe: {
          ...aiSuggestion,
          foodId: savedFood._id, // Return ID so frontend can easily POST to /api/meal-logs/:id/items
        },
        context: {
          dailyGoal,
          consumedCalories,
          remainingCalories,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
