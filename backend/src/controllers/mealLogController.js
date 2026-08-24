const { supabase } = require('../config/db');
const ApiError = require('../utils/ApiError');

const dayStr = (dateInput) => {
  if (!dateInput) return new Date().toISOString().split('T')[0];
  const d = new Date(dateInput);
  if (isNaN(d)) throw new ApiError(400, 'Invalid date format. Use YYYY-MM-DD.');
  return d.toISOString().split('T')[0];
};

const mapMealItem = (row, foodRow = null) => {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    mealLogId: row.meal_log_id,
    foodId: foodRow
      ? {
          _id: foodRow.id,
          id: foodRow.id,
          name: foodRow.name,
          caloriesPerServing: Number(foodRow.calories || 0),
          proteinG: Number(foodRow.protein_g || 0),
          carbsG: Number(foodRow.carbs_g || 0),
          fatG: Number(foodRow.fat_g || 0),
          servingSize: Number(foodRow.serving_size_g || 100),
          servingUnit: foodRow.serving_size || 'g',
        }
      : row.food_id,
    quantity: Number(row.quantity),
    calories: Number(row.calories),
    proteinG: Number(row.protein_g),
    carbsG: Number(row.carbs_g),
    fatG: Number(row.fat_g),
    createdAt: row.created_at,
  };
};

exports.getDailyLogs = async (req, res, next) => {
  try {
    const targetDate = dayStr(req.query.date);

    const { data: logs, error } = await supabase
      .from('meal_logs')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('date', targetDate);

    if (error) throw new ApiError(500, `Database error: ${error.message}`);

    const logsWithItems = await Promise.all(
      (logs || []).map(async (log) => {
        const { data: itemRows } = await supabase
          .from('meal_items')
          .select('*, foods(*)')
          .eq('meal_log_id', log.id);

        const items = (itemRows || []).map((item) => mapMealItem(item, item.foods));

        return {
          _id: log.id,
          id: log.id,
          userId: log.user_id,
          date: log.date,
          mealType: log.meal_type,
          createdAt: log.created_at,
          updatedAt: log.updated_at,
          items,
        };
      })
    );

    res.status(200).json({ success: true, data: logsWithItems });
  } catch (err) {
    next(err);
  }
};

exports.getDailySummary = async (req, res, next) => {
  try {
    const targetDate = dayStr(req.query.date);

    const { data: logs } = await supabase
      .from('meal_logs')
      .select('id')
      .eq('user_id', req.user.id)
      .eq('date', targetDate);

    const logIds = (logs || []).map((l) => l.id);

    let items = [];
    if (logIds.length > 0) {
      const { data: itemRows } = await supabase
        .from('meal_items')
        .select('*')
        .in('meal_log_id', logIds);
      items = itemRows || [];
    }

    const consumed = items.reduce(
      (acc, item) => {
        acc.calories += Number(item.calories || 0);
        acc.proteinG += Number(item.protein_g || 0);
        acc.carbsG += Number(item.carbs_g || 0);
        acc.fatG += Number(item.fat_g || 0);
        return acc;
      },
      { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 }
    );

    Object.keys(consumed).forEach((k) => {
      consumed[k] = Math.round(consumed[k] * 10) / 10;
    });

    const { data: goalRow } = await supabase
      .from('nutrition_goals')
      .select('*')
      .eq('user_id', req.user.id)
      .maybeSingle();

    const goal = goalRow
      ? {
          calories: Number(goalRow.daily_calories),
          proteinG: Number(goalRow.protein_g),
          carbsG: Number(goalRow.carbs_g),
          fatG: Number(goalRow.fat_g),
        }
      : null;

    res.status(200).json({
      success: true,
      data: {
        date: targetDate,
        consumed,
        goal,
        remaining: goal
          ? {
              calories: Math.max(0, goal.calories - consumed.calories),
              proteinG: Math.max(0, goal.proteinG - consumed.proteinG),
              carbsG: Math.max(0, goal.carbsG - consumed.carbsG),
              fatG: Math.max(0, goal.fatG - consumed.fatG),
            }
          : null,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.createOrGetMealLog = async (req, res, next) => {
  try {
    const { date, mealType } = req.body;
    if (!date || !mealType) throw new ApiError(400, 'date and mealType are required.');

    const targetDate = dayStr(date);

    let { data: log } = await supabase
      .from('meal_logs')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('date', targetDate)
      .eq('meal_type', mealType)
      .maybeSingle();

    if (!log) {
      const { data: newLog, error } = await supabase
        .from('meal_logs')
        .insert([
          {
            user_id: req.user.id,
            date: targetDate,
            meal_type: mealType,
          },
        ])
        .select()
        .single();

      if (error || !newLog) throw new ApiError(500, `Failed to create meal log: ${error?.message}`);
      log = newLog;
    }

    res.status(200).json({
      success: true,
      data: {
        _id: log.id,
        id: log.id,
        userId: log.user_id,
        date: log.date,
        mealType: log.meal_type,
        createdAt: log.created_at,
        updatedAt: log.updated_at,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.addItemToMeal = async (req, res, next) => {
  try {
    const { foodId, quantity } = req.body;
    if (!foodId || !quantity) throw new ApiError(400, 'foodId and quantity are required.');

    const { data: log } = await supabase
      .from('meal_logs')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .maybeSingle();

    if (!log) throw new ApiError(404, 'Meal log not found.');

    const { data: food } = await supabase
      .from('foods')
      .select('*')
      .eq('id', foodId)
      .maybeSingle();

    if (!food) throw new ApiError(404, 'Food not found.');

    const factor = Number(quantity);
    const calories = Math.round(Number(food.calories || 0) * factor * 10) / 10;
    const proteinG = Math.round(Number(food.protein_g || 0) * factor * 10) / 10;
    const carbsG = Math.round(Number(food.carbs_g || 0) * factor * 10) / 10;
    const fatG = Math.round(Number(food.fat_g || 0) * factor * 10) / 10;

    const { data: itemRow, error } = await supabase
      .from('meal_items')
      .insert([
        {
          meal_log_id: log.id,
          food_id: food.id,
          quantity: factor,
          calories,
          protein_g: proteinG,
          carbs_g: carbsG,
          fat_g: fatG,
        },
      ])
      .select()
      .single();

    if (error || !itemRow) throw new ApiError(500, `Failed to add item: ${error?.message}`);

    const item = mapMealItem(itemRow, food);

    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

exports.removeItemFromMeal = async (req, res, next) => {
  try {
    const { data: log } = await supabase
      .from('meal_logs')
      .select('*')
      .eq('id', req.params.mealLogId)
      .eq('user_id', req.user.id)
      .maybeSingle();

    if (!log) throw new ApiError(404, 'Meal log not found.');

    const { error } = await supabase
      .from('meal_items')
      .delete()
      .eq('id', req.params.itemId)
      .eq('meal_log_id', log.id);

    if (error) throw new ApiError(404, 'Meal item not found.');

    res.status(200).json({ success: true, message: 'Item removed from meal.' });
  } catch (err) {
    next(err);
  }
};
