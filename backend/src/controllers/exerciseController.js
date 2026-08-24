const { body } = require('express-validator');
const { supabase } = require('../config/db');
const ApiError = require('../utils/ApiError');

const mapExercise = (row) => {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    name: row.name,
    muscleGroup: row.target_muscle || row.category,
    targetMuscle: row.target_muscle,
    category: row.category,
    equipment: row.equipment,
    description: row.description,
    videoUrl: row.video_url,
    gifUrl: row.gif_url,
    instructions: row.instructions || [],
    createdAt: row.created_at,
  };
};

const createExerciseValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Exercise name is required.')
    .isLength({ max: 100 })
    .withMessage('Exercise name must be at most 100 characters.'),
  body('muscleGroup')
    .optional()
    .trim(),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be at most 1000 characters.'),
  body('videoUrl')
    .optional()
    .trim(),
];

const getExercises = async (req, res, next) => {
  try {
    let query = supabase.from('exercises').select('*').order('name', { ascending: true });

    if (req.query.muscleGroup) {
      query = query.or(`target_muscle.eq.${req.query.muscleGroup},category.eq.${req.query.muscleGroup}`);
    }

    const { data: rows, error } = await query;

    if (error) {
      throw new ApiError(500, `Database error: ${error.message}`);
    }

    const exercises = (rows || []).map(mapExercise);

    res.status(200).json({
      success: true,
      count: exercises.length,
      data: { exercises },
    });
  } catch (error) {
    next(error);
  }
};

const getExerciseById = async (req, res, next) => {
  try {
    const { data: row, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('id', req.params.id)
      .maybeSingle();

    if (error || !row) {
      throw new ApiError(404, 'Exercise not found.');
    }

    res.status(200).json({
      success: true,
      data: { exercise: mapExercise(row) },
    });
  } catch (error) {
    next(error);
  }
};

const createExercise = async (req, res, next) => {
  try {
    const { name, muscleGroup, targetMuscle, category, description, videoUrl } = req.body;

    const { data: newRow, error } = await supabase
      .from('exercises')
      .insert([
        {
          name,
          target_muscle: targetMuscle || muscleGroup,
          category: category || muscleGroup,
          description,
          video_url: videoUrl,
        },
      ])
      .select()
      .single();

    if (error || !newRow) {
      throw new ApiError(500, `Failed to create exercise: ${error?.message}`);
    }

    res.status(201).json({
      success: true,
      message: 'Exercise created successfully.',
      data: { exercise: mapExercise(newRow) },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExercises,
  getExerciseById,
  createExercise,
  createExerciseValidation,
  mapExercise,
};
