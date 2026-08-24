const ApiError = require('../utils/ApiError');
const { supabase } = require('../config/db');
const { suggestSnack } = require('../ai/snackAI');

exports.suggestSnack = async (req, res, next) => {
  try {
    const { preference, date } = req.body;
    const targetDate = date ? new Date(date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

    const { data: goalRow } = await supabase
      .from('nutrition_goals')
      .select('daily_calories')
      .eq('user_id', req.user.id)
      .maybeSingle();

    const dailyGoal = goalRow ? Number(goalRow.daily_calories) : 2000;

    const { data: mealLogs } = await supabase
      .from('meal_logs')
      .select('id')
      .eq('user_id', req.user.id)
      .eq('date', targetDate);

    const logIds = (mealLogs || []).map((l) => l.id);

    let consumedCalories = 0;
    if (logIds.length > 0) {
      const { data: items } = await supabase
        .from('meal_items')
        .select('calories')
        .in('meal_log_id', logIds);

      (items || []).forEach((item) => {
        consumedCalories += Number(item.calories || 0);
      });
    }

    const remainingCalories = Math.max(0, dailyGoal - consumedCalories);

    const aiSuggestion = await suggestSnack(remainingCalories, preference);

    const { data: savedFood } = await supabase
      .from('foods')
      .insert([
        {
          name: aiSuggestion.name,
          calories: aiSuggestion.caloriesPerServing || aiSuggestion.calories || 0,
          protein_g: aiSuggestion.proteinG || 0,
          carbs_g: aiSuggestion.carbsG || 0,
          fat_g: aiSuggestion.fatG || 0,
          serving_size_g: aiSuggestion.servingSize || 100,
          serving_size: aiSuggestion.servingUnit || 'porsiyon',
          source: 'ai',
        },
      ])
      .select()
      .single();

    res.status(200).json({
      success: true,
      data: {
        recipe: {
          ...aiSuggestion,
          foodId: savedFood ? savedFood.id : null,
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
