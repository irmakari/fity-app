const { body, query } = require('express-validator');
const { supabase } = require('../config/db');
const ApiError = require('../utils/ApiError');

const logStatusValidation = [
  body('workoutPlanId')
    .notEmpty()
    .withMessage('Workout plan ID is required.'),
  body('exerciseId')
    .notEmpty()
    .withMessage('Exercise ID is required.'),
  body('date')
    .notEmpty()
    .withMessage('Date is required.')
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date.'),
  body('isCompleted')
    .optional()
    .isBoolean()
    .withMessage('isCompleted must be true or false.'),
  body('hasDiscomfort')
    .optional()
    .isBoolean()
    .withMessage('hasDiscomfort must be true or false.'),
  body('note')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Note must be at most 500 characters.'),
];

const updateStatusValidation = [
  body('isCompleted')
    .optional()
    .isBoolean()
    .withMessage('isCompleted must be true or false.'),
  body('hasDiscomfort')
    .optional()
    .isBoolean()
    .withMessage('hasDiscomfort must be true or false.'),
  body('note')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Note must be at most 500 characters.'),
];

const getStatusesValidation = [
  query('date')
    .optional()
    .isISO8601()
    .withMessage('date must be a valid ISO 8601 date.'),
  query('workoutPlanId')
    .optional(),
];

const mapStatus = (row) => {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    userId: row.user_id,
    exerciseId: row.exercise_id,
    personalRecordWeightKg: Number(row.personal_record_weight_kg || 0),
    personalRecordReps: row.personal_record_reps || 0,
    lastPerformedAt: row.last_performed_at,
    totalVolumeKg: Number(row.total_volume_kg || 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

const logExerciseStatus = async (req, res, next) => {
  try {
    const { exerciseId, personalRecordWeightKg, personalRecordReps, totalVolumeKg } = req.body;

    const { data: existing } = await supabase
      .from('workout_exercise_statuses')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('exercise_id', exerciseId)
      .maybeSingle();

    let updatedRow;
    const now = new Date().toISOString();

    if (existing) {
      const { data, error } = await supabase
        .from('workout_exercise_statuses')
        .update({
          personal_record_weight_kg: personalRecordWeightKg ?? existing.personal_record_weight_kg,
          personal_record_reps: personalRecordReps ?? existing.personal_record_reps,
          total_volume_kg: totalVolumeKg ?? existing.total_volume_kg,
          last_performed_at: now,
          updated_at: now,
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw new ApiError(500, `Database error: ${error.message}`);
      updatedRow = data;
    } else {
      const { data, error } = await supabase
        .from('workout_exercise_statuses')
        .insert([
          {
            user_id: req.user.id,
            exercise_id: exerciseId,
            personal_record_weight_kg: personalRecordWeightKg || 0,
            personal_record_reps: personalRecordReps || 0,
            total_volume_kg: totalVolumeKg || 0,
            last_performed_at: now,
          },
        ])
        .select()
        .single();

      if (error) throw new ApiError(500, `Database error: ${error.message}`);
      updatedRow = data;
    }

    res.status(201).json({
      success: true,
      message: 'Exercise status logged.',
      data: { status: mapStatus(updatedRow) },
    });
  } catch (error) {
    next(error);
  }
};

const getExerciseStatuses = async (req, res, next) => {
  try {
    let query = supabase
      .from('workout_exercise_statuses')
      .select('*, exercises(id, name, target_muscle, category)')
      .eq('user_id', req.user.id)
      .order('updated_at', { ascending: false });

    const { data: rows, error } = await query;

    if (error) {
      throw new ApiError(500, `Database error: ${error.message}`);
    }

    const statuses = (rows || []).map((r) => ({
      ...mapStatus(r),
      exerciseId: r.exercises
        ? {
            _id: r.exercises.id,
            id: r.exercises.id,
            name: r.exercises.name,
            muscleGroup: r.exercises.target_muscle || r.exercises.category,
          }
        : r.exercise_id,
    }));

    res.status(200).json({
      success: true,
      count: statuses.length,
      data: { statuses },
    });
  } catch (error) {
    next(error);
  }
};

const updateExerciseStatus = async (req, res, next) => {
  try {
    const { personalRecordWeightKg, personalRecordReps, totalVolumeKg } = req.body;

    const updates = { updated_at: new Date().toISOString() };
    if (personalRecordWeightKg !== undefined) updates.personal_record_weight_kg = personalRecordWeightKg;
    if (personalRecordReps !== undefined) updates.personal_record_reps = personalRecordReps;
    if (totalVolumeKg !== undefined) updates.total_volume_kg = totalVolumeKg;

    const { data: updatedRow, error } = await supabase
      .from('workout_exercise_statuses')
      .update(updates)
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select('*, exercises(id, name, target_muscle, category)')
      .single();

    if (error || !updatedRow) {
      throw new ApiError(404, 'Exercise status record not found.');
    }

    const status = {
      ...mapStatus(updatedRow),
      exerciseId: updatedRow.exercises
        ? {
            _id: updatedRow.exercises.id,
            id: updatedRow.exercises.id,
            name: updatedRow.exercises.name,
            muscleGroup: updatedRow.exercises.target_muscle || updatedRow.exercises.category,
          }
        : updatedRow.exercise_id,
    };

    res.status(200).json({
      success: true,
      message: 'Exercise status updated.',
      data: { status },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  logExerciseStatus,
  getExerciseStatuses,
  updateExerciseStatus,
  logStatusValidation,
  updateStatusValidation,
  getStatusesValidation,
};
