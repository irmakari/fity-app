const Food = require('../models/Food');
const { searchFood: offSearch } = require('../services/openFoodFactsService');
const { lookupFoodNutrition } = require('../ai/foodAI');
const ApiError = require('../utils/ApiError');

// ============================================================
// SEARCH — Hybrid: DB → Open Food Facts → Gemini AI
// ============================================================

/**
 * GET /api/foods/search?q=kuymak
 *
 * Step 1: Search our own Food collection (text index).
 * Step 2: If nothing found, query Open Food Facts (free, no key).
 * Step 3: If still nothing, fall back to Gemini AI.
 * Step 4: Cache any external result in our DB for future queries.
 */
exports.searchFood = async (req, res, next) => {
  try {
    const query = (req.query.q || '').trim();
    if (!query) throw new ApiError(400, 'Search query (q) is required.');

    // ── Step 1: Local DB ──────────────────────────────────────
    const dbResults = await Food.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(10);

    if (dbResults.length > 0) {
      return res.status(200).json({
        success: true,
        source: 'database',
        data: dbResults,
      });
    }

    // ── Step 2: Open Food Facts ───────────────────────────────
    const offResult = await offSearch(query);

    if (offResult) {
      // Cache in DB — ignore duplicate key errors
      const saved = await Food.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${offResult.name}$`, 'i') } },
        { $setOnInsert: offResult },
        { upsert: true, new: true, runValidators: true }
      );

      return res.status(200).json({
        success: true,
        source: 'open_food_facts',
        data: [saved],
      });
    }

    // ── Step 3: Gemini AI ─────────────────────────────────────
    const aiResult = await lookupFoodNutrition(query);

    if (aiResult) {
      const saved = await Food.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${aiResult.name}$`, 'i') } },
        { $setOnInsert: aiResult },
        { upsert: true, new: true, runValidators: true }
      );

      return res.status(200).json({
        success: true,
        source: 'ai',
        data: [saved],
      });
    }

    // ── Nothing found ─────────────────────────────────────────
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

// ============================================================
// CREATE — Manual food entry by user
// ============================================================

/**
 * POST /api/foods
 * Body: { name, caloriesPerServing, proteinG, carbsG, fatG, servingSize, servingUnit }
 */
exports.createFood = async (req, res, next) => {
  try {
    const { name, caloriesPerServing, proteinG, carbsG, fatG, servingSize, servingUnit } =
      req.body;

    if (!name || caloriesPerServing === undefined) {
      throw new ApiError(400, 'name and caloriesPerServing are required.');
    }

    // Prevent exact-name duplicates (case-insensitive)
    const existing = await Food.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existing) {
      return res.status(200).json({
        success: true,
        message: 'Food already exists.',
        data: existing,
      });
    }

    const food = await Food.create({
      name: name.trim(),
      caloriesPerServing,
      proteinG: proteinG || 0,
      carbsG: carbsG || 0,
      fatG: fatG || 0,
      servingSize: servingSize || 100,
      servingUnit: servingUnit || 'g',
    });

    res.status(201).json({ success: true, data: food });
  } catch (err) {
    next(err);
  }
};

// ============================================================
// GET BY ID
// ============================================================

/**
 * GET /api/foods/:id
 */
exports.getFoodById = async (req, res, next) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) throw new ApiError(404, 'Food not found.');
    res.status(200).json({ success: true, data: food });
  } catch (err) {
    next(err);
  }
};
