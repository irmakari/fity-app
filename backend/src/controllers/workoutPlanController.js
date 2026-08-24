const { body } = require('express-validator');
const { supabase } = require('../config/db');
const ApiError = require('../utils/ApiError');

const mapPlan = async (row) => {
  if (!row) return null;

  // Populate exercises if exercises JSON array exists
  let exercises = row.exercises || [];
  if (Array.isArray(exercises) && exercises.length > 0) {
    const exerciseIds = exercises.map((e) => e.exerciseId).filter(Boolean);

    if (exerciseIds.length > 0) {
      const { data: exRows } = await supabase
        .from('exercises')
        .select('*')
        .in('id', exerciseIds);

      const exMap = (exRows || []).reduce((acc, ex) => {
        acc[ex.id] = {
          _id: ex.id,
          id: ex.id,
          name: ex.name,
          muscleGroup: ex.target_muscle || ex.category,
          description: ex.description,
          videoUrl: ex.video_url,
        };
        return acc;
      }, {});

      exercises = exercises.map((item) => ({
        ...item,
        exerciseId: exMap[item.exerciseId] || item.exerciseId,
      }));
    }
  }

  return {
    _id: row.id,
    id: row.id,
    name: row.name,
    dayLabel: row.day_label,
    targetMuscles: row.target_muscles || [],
    estimatedDurationMin: row.estimated_duration_min,
    exercises,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

const createPlanValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Plan name is required.')
    .isLength({ max: 100 })
    .withMessage('Plan name must be at most 100 characters.'),
  body('dayLabel')
    .optional()
    .trim(),
  body('targetMuscles')
    .optional()
    .isArray()
    .withMessage('Target muscles must be an array.'),
  body('estimatedDurationMin')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Estimated duration must be at least 1 minute.'),
  body('exercises')
    .optional()
    .isArray()
    .withMessage('Exercises must be an array.'),
  body('exercises.*.exerciseId')
    .notEmpty()
    .withMessage('Exercise ID is required.'),
  body('exercises.*.sets')
    .isInt({ min: 1 })
    .withMessage('Sets must be at least 1.'),
  body('exercises.*.reps')
    .isInt({ min: 1 })
    .withMessage('Reps must be at least 1.'),
  body('exercises.*.restSeconds')
    .isInt({ min: 0 })
    .withMessage('Rest seconds cannot be negative.'),
  body('exercises.*.orderIndex')
    .isInt({ min: 0 })
    .withMessage('Order index cannot be negative.'),
];

const updatePlanValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Plan name cannot be empty.')
    .isLength({ max: 100 })
    .withMessage('Plan name must be at most 100 characters.'),
  body('dayLabel')
    .optional()
    .trim(),
  body('targetMuscles')
    .optional()
    .isArray()
    .withMessage('Target muscles must be an array.'),
  body('estimatedDurationMin')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Estimated duration must be at least 1 minute.'),
  body('exercises')
    .optional()
    .isArray()
    .withMessage('Exercises must be an array.'),
  body('exercises.*.exerciseId')
    .notEmpty()
    .withMessage('Exercise ID is required.'),
  body('exercises.*.sets')
    .isInt({ min: 1 })
    .withMessage('Sets must be at least 1.'),
  body('exercises.*.reps')
    .isInt({ min: 1 })
    .withMessage('Reps must be at least 1.'),
  body('exercises.*.restSeconds')
    .isInt({ min: 0 })
    .withMessage('Rest seconds cannot be negative.'),
  body('exercises.*.orderIndex')
    .isInt({ min: 0 })
    .withMessage('Order index cannot be negative.'),
];

const getWorkoutPlans = async (req, res, next) => {
  try {
    const { data: rows, error } = await supabase
      .from('workout_plans')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new ApiError(500, `Database error: ${error.message}`);
    }

    const plans = await Promise.all((rows || []).map(mapPlan));

    res.status(200).json({
      success: true,
      count: plans.length,
      data: { plans },
    });
  } catch (error) {
    next(error);
  }
};

const getWorkoutPlanById = async (req, res, next) => {
  try {
    const { data: row, error } = await supabase
      .from('workout_plans')
      .select('*')
      .eq('id', req.params.id)
      .maybeSingle();

    if (error || !row) {
      throw new ApiError(404, 'Workout plan not found.');
    }

    const plan = await mapPlan(row);

    res.status(200).json({
      success: true,
      data: { plan },
    });
  } catch (error) {
    next(error);
  }
};

const createWorkoutPlan = async (req, res, next) => {
  try {
    const { name, dayLabel, targetMuscles, estimatedDurationMin, exercises } = req.body;

    const { data: newRow, error } = await supabase
      .from('workout_plans')
      .insert([
        {
          name,
          day_label: dayLabel,
          target_muscles: targetMuscles || [],
          estimated_duration_min: estimatedDurationMin,
          exercises: exercises || [],
        },
      ])
      .select()
      .single();

    if (error || !newRow) {
      throw new ApiError(500, `Failed to create workout plan: ${error?.message}`);
    }

    const plan = await mapPlan(newRow);

    res.status(201).json({
      success: true,
      message: 'Workout plan created successfully.',
      data: { plan },
    });
  } catch (error) {
    next(error);
  }
};

const updateWorkoutPlan = async (req, res, next) => {
  try {
    const fieldMapping = {
      name: 'name',
      dayLabel: 'day_label',
      targetMuscles: 'target_muscles',
      estimatedDurationMin: 'estimated_duration_min',
      exercises: 'exercises',
    };

    const updates = {};
    Object.keys(fieldMapping).forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[fieldMapping[field]] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      throw new ApiError(400, 'No valid fields to update.');
    }

    updates.updated_at = new Date().toISOString();

    const { data: updatedRow, error } = await supabase
      .from('workout_plans')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !updatedRow) {
      throw new ApiError(404, 'Workout plan not found.');
    }

    const plan = await mapPlan(updatedRow);

    res.status(200).json({
      success: true,
      message: 'Workout plan updated successfully.',
      data: { plan },
    });
  } catch (error) {
    next(error);
  }
};

const deleteWorkoutPlan = async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('workout_plans')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      throw new ApiError(404, 'Workout plan not found or delete failed.');
    }

    res.status(200).json({
      success: true,
      message: 'Workout plan deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWorkoutPlans,
  getWorkoutPlanById,
  createWorkoutPlan,
  updateWorkoutPlan,
  deleteWorkoutPlan,
  createPlanValidation,
  updatePlanValidation,
};
