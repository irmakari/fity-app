const { supabase } = require('../config/db');
const { searchFood: offSearch } = require('../services/openFoodFactsService');
const { lookupFoodNutrition } = require('../ai/foodAI');
const ApiError = require('../utils/ApiError');

const mapFood = (row) => {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    name: row.name,
    caloriesPerServing: Number(row.calories || 0),
    calories: Number(row.calories || 0),
    proteinG: Number(row.protein_g || 0),
    carbsG: Number(row.carbs_g || 0),
    fatG: Number(row.fat_g || 0),
    servingSize: Number(row.serving_size_g || 100),
    servingUnit: row.serving_size || 'g',
    brand: row.brand,
    source: row.source,
    createdAt: row.created_at,
  };
};

exports.searchFood = async (req, res, next) => {
  try {
    const query = (req.query.q || '').trim();
    if (!query) throw new ApiError(400, 'Search query (q) is required.');

    // ── Step 1: Local DB Search ───────────────────────────────
    const { data: dbRows } = await supabase
      .from('foods')
      .select('*')
      .ilike('name', `%${query}%`)
      .limit(10);

    if (dbRows && dbRows.length > 0) {
      return res.status(200).json({
        success: true,
        source: 'database',
        data: dbRows.map(mapFood),
      });
    }

    // ── Step 2: Open Food Facts ───────────────────────────────
    const offResult = await offSearch(query);

    if (offResult) {
      const { data: saved, error } = await supabase
        .from('foods')
        .insert([
          {
            name: offResult.name,
            calories: offResult.caloriesPerServing || offResult.calories || 0,
            protein_g: offResult.proteinG || 0,
            carbs_g: offResult.carbsG || 0,
            fat_g: offResult.fatG || 0,
            serving_size_g: offResult.servingSize || 100,
            serving_size: offResult.servingUnit || 'g',
            source: 'open_food_facts',
          },
        ])
        .select()
        .single();

      const resultObj = saved ? mapFood(saved) : offResult;

      return res.status(200).json({
        success: true,
        source: 'open_food_facts',
        data: [resultObj],
      });
    }

    // ── Step 3: Gemini AI ─────────────────────────────────────
    const aiResult = await lookupFoodNutrition(query);

    if (aiResult) {
      const { data: saved } = await supabase
        .from('foods')
        .insert([
          {
            name: aiResult.name || query,
            calories: aiResult.caloriesPerServing || aiResult.calories || 0,
            protein_g: aiResult.proteinG || 0,
            carbs_g: aiResult.carbsG || 0,
            fat_g: aiResult.fatG || 0,
            serving_size_g: aiResult.servingSize || 100,
            serving_size: aiResult.servingUnit || 'g',
            source: 'ai',
          },
        ])
        .select()
        .single();

      const resultObj = saved ? mapFood(saved) : aiResult;

      return res.status(200).json({
        success: true,
        source: 'ai',
        data: [resultObj],
      });
    }

    return res.status(200).json({
      success: true,
      source: 'none',
      data: [],
      message: 'No food found. You can add it manually.',
    });
  } catch (err) {
    next(err);
  }
};

exports.createFood = async (req, res, next) => {
  try {
    const { name, caloriesPerServing, calories, proteinG, carbsG, fatG, servingSize, servingUnit } =
      req.body;

    const foodName = (name || '').trim();
    const cals = caloriesPerServing !== undefined ? caloriesPerServing : calories;

    if (!foodName || cals === undefined) {
      throw new ApiError(400, 'name and calories are required.');
    }

    const { data: existing } = await supabase
      .from('foods')
      .select('*')
      .ilike('name', foodName)
      .maybeSingle();

    if (existing) {
      return res.status(200).json({
        success: true,
        message: 'Food already exists.',
        data: mapFood(existing),
      });
    }

    const { data: newRow, error } = await supabase
      .from('foods')
      .insert([
        {
          name: foodName,
          calories: cals,
          protein_g: proteinG || 0,
          carbs_g: carbsG || 0,
          fat_g: fatG || 0,
          serving_size_g: servingSize || 100,
          serving_size: servingUnit || 'g',
          source: 'custom',
        },
      ])
      .select()
      .single();

    if (error || !newRow) {
      throw new ApiError(500, `Failed to create food: ${error?.message}`);
    }

    res.status(201).json({ success: true, data: mapFood(newRow) });
  } catch (err) {
    next(err);
  }
};

exports.getFoodById = async (req, res, next) => {
  try {
    const { data: row, error } = await supabase
      .from('foods')
      .select('*')
      .eq('id', req.params.id)
      .maybeSingle();

    if (error || !row) throw new ApiError(404, 'Food not found.');
    res.status(200).json({ success: true, data: mapFood(row) });
  } catch (err) {
    next(err);
  }
};
