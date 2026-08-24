const { body } = require('express-validator');
const { supabase } = require('../config/db');
const ApiError = require('../utils/ApiError');

const mapSession = async (row) => {
  if (!row) return null;

  let workoutPlan = null;
  if (row.workout_plan_id) {
    const { data: planRow } = await supabase
      .from('workout_plans')
      .select('id, name, day_label, target_muscles, estimated_duration_min')
      .eq('id', row.workout_plan_id)
      .maybeSingle();

    if (planRow) {
      workoutPlan = {
        _id: planRow.id,
        id: planRow.id,
        name: planRow.name,
        dayLabel: planRow.day_label,
        targetMuscles: planRow.target_muscles || [],
        estimatedDurationMin: planRow.estimated_duration_min,
      };
    }
  }

  return {
    _id: row.id,
    id: row.id,
    userId: row.user_id,
    workoutPlanId: workoutPlan || row.workout_plan_id,
    status: row.status,
    startedAt: row.started_at,
    finishedAt: row.finished_at,
    totalDurationSec: row.total_duration_sec,
    caloriesBurned: Number(row.calories_burned || 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

const mapSet = (row, exerciseRow = null) => {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    sessionId: row.workout_session_id,
    workoutSessionId: row.workout_session_id,
    exerciseId: exerciseRow
      ? {
          _id: exerciseRow.id,
          id: exerciseRow.id,
          name: exerciseRow.name,
          muscleGroup: exerciseRow.target_muscle || exerciseRow.category,
        }
      : row.exercise_id,
    setNumber: row.set_number,
    reps: row.reps,
    repsCompleted: row.reps,
    weightKg: Number(row.weight_kg || 0),
    isCompleted: row.is_completed,
    completedAt: row.completed_at,
    createdAt: row.created_at,
  };
};

const startSessionValidation = [
  body('workoutPlanId')
    .notEmpty()
    .withMessage('Workout plan ID is required.'),
];

const finishSessionValidation = [
  body('status')
    .isIn(['completed', 'cancelled'])
    .withMessage('Status must be completed or cancelled.'),
  body('finishedAt')
    .optional()
    .isISO8601()
    .withMessage('finishedAt must be a valid date.'),
  body('totalDurationSec')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Total duration cannot be negative.'),
  body('caloriesBurned')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Calories burned cannot be negative.'),
];

const logSetValidation = [
  body('exerciseId')
    .notEmpty()
    .withMessage('Exercise ID is required.'),
  body('setNumber')
    .isInt({ min: 1 })
    .withMessage('Set number must be at least 1.'),
  body('repsCompleted')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Reps completed cannot be negative.'),
  body('weightKg')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Weight cannot be negative.'),
  body('completedAt')
    .optional()
    .isISO8601()
    .withMessage('completedAt must be a valid date.'),
];

const startSession = async (req, res, next) => {
  try {
    const { workoutPlanId } = req.body;

    const { data: newRow, error } = await supabase
      .from('workout_sessions')
      .insert([
        {
          user_id: req.user.id,
          workout_plan_id: workoutPlanId,
          status: 'in_progress',
          started_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error || !newRow) {
      throw new ApiError(500, `Failed to start workout session: ${error?.message}`);
    }

    const session = await mapSession(newRow);

    res.status(201).json({
      success: true,
      message: 'Workout session started.',
      data: { session },
    });
  } catch (error) {
    next(error);
  }
};

const getUserSessions = async (req, res, next) => {
  try {
    const { data: rows, error } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('user_id', req.user.id)
      .order('started_at', { ascending: false });

    if (error) {
      throw new ApiError(500, `Database error: ${error.message}`);
    }

    const sessions = await Promise.all((rows || []).map(mapSession));

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: { sessions },
    });
  } catch (error) {
    next(error);
  }
};

const getSessionById = async (req, res, next) => {
  try {
    const { data: row, error } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .maybeSingle();

    if (error || !row) {
      throw new ApiError(404, 'Session not found.');
    }

    const session = await mapSession(row);

    const { data: setRows } = await supabase
      .from('workout_session_sets')
      .select('*, exercises(id, name, target_muscle, category)')
      .eq('workout_session_id', row.id)
      .order('created_at', { ascending: true });

    const sets = (setRows || []).map((s) => mapSet(s, s.exercises));

    res.status(200).json({
      success: true,
      data: { session, sets },
    });
  } catch (error) {
    next(error);
  }
};

const finishSession = async (req, res, next) => {
  try {
    const { data: session, error } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .maybeSingle();

    if (error || !session) {
      throw new ApiError(404, 'Session not found.');
    }

    if (session.status !== 'in_progress') {
      throw new ApiError(400, 'Only in-progress sessions can be finished or cancelled.');
    }

    const { status, finishedAt, totalDurationSec, caloriesBurned } = req.body;

    const updates = {
      status,
      finished_at: finishedAt ? new Date(finishedAt).toISOString() : new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (totalDurationSec !== undefined) updates.total_duration_sec = totalDurationSec;
    if (caloriesBurned !== undefined) updates.calories_burned = caloriesBurned;

    const { data: updatedRow, error: updateErr } = await supabase
      .from('workout_sessions')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (updateErr || !updatedRow) {
      throw new ApiError(500, `Failed to update session: ${updateErr?.message}`);
    }

    const updatedSession = await mapSession(updatedRow);

    res.status(200).json({
      success: true,
      message: `Workout session ${status}.`,
      data: { session: updatedSession },
    });
  } catch (error) {
    next(error);
  }
};

const logSet = async (req, res, next) => {
  try {
    const { data: session } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .maybeSingle();

    if (!session) {
      throw new ApiError(404, 'Session not found.');
    }

    if (session.status !== 'in_progress') {
      throw new ApiError(400, 'Sets can only be logged for in-progress sessions.');
    }

    const { exerciseId, setNumber, repsCompleted, reps, weightKg, completedAt } = req.body;

    const { data: setRow, error } = await supabase
      .from('workout_session_sets')
      .insert([
        {
          workout_session_id: session.id,
          exercise_id: exerciseId,
          set_number: setNumber,
          reps: repsCompleted !== undefined ? repsCompleted : reps || 0,
          weight_kg: weightKg || 0,
          is_completed: true,
          completed_at: completedAt ? new Date(completedAt).toISOString() : new Date().toISOString(),
        },
      ])
      .select('*, exercises(id, name, target_muscle, category)')
      .single();

    if (error || !setRow) {
      throw new ApiError(500, `Failed to log set: ${error?.message}`);
    }

    const setObj = mapSet(setRow, setRow.exercises);

    res.status(201).json({
      success: true,
      message: 'Set logged successfully.',
      data: { set: setObj },
    });
  } catch (error) {
    next(error);
  }
};

const getSessionSets = async (req, res, next) => {
  try {
    const { data: session } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .maybeSingle();

    if (!session) {
      throw new ApiError(404, 'Session not found.');
    }

    const { data: setRows } = await supabase
      .from('workout_session_sets')
      .select('*, exercises(id, name, target_muscle, category)')
      .eq('workout_session_id', session.id)
      .order('completed_at', { ascending: true });

    const sets = (setRows || []).map((s) => mapSet(s, s.exercises));

    res.status(200).json({
      success: true,
      count: sets.length,
      data: { sets },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  startSession,
  getUserSessions,
  getSessionById,
  finishSession,
  logSet,
  getSessionSets,
  startSessionValidation,
  finishSessionValidation,
  logSetValidation,
};
