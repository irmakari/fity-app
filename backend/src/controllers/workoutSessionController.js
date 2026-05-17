const { body } = require('express-validator');
const mongoose = require('mongoose');
const WorkoutSession = require('../models/WorkoutSession');
const WorkoutSessionSet = require('../models/WorkoutSessionSet');
const ApiError = require('../utils/ApiError');

// ============================================================
// VALIDATION RULES
// ============================================================

const startSessionValidation = [
  body('workoutPlanId')
    .notEmpty()
    .withMessage('Workout plan ID is required.')
    .isMongoId()
    .withMessage('Invalid workout plan ID.'),
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
    .withMessage('Exercise ID is required.')
    .isMongoId()
    .withMessage('Invalid exercise ID.'),
  body('setNumber')
    .isInt({ min: 1 })
    .withMessage('Set number must be at least 1.'),
  body('repsCompleted')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Reps completed cannot be negative.'),
  body('restSkipped')
    .optional()
    .isBoolean()
    .withMessage('restSkipped must be true or false.'),
  body('completedAt')
    .optional()
    .isISO8601()
    .withMessage('completedAt must be a valid date.'),
];

// ============================================================
// CONTROLLER METHODS
// ============================================================

/**
 * @desc    Start a new workout session
 * @route   POST /api/workout-sessions
 * @access  Private
 */
const startSession = async (req, res, next) => {
  try {
    const { workoutPlanId } = req.body;

    const session = await WorkoutSession.create({
      userId: req.user._id,
      workoutPlanId,
      status: 'in_progress',
    });

    res.status(201).json({
      success: true,
      message: 'Workout session started.',
      data: { session },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all sessions for the authenticated user
 * @route   GET /api/workout-sessions
 * @access  Private
 */
const getUserSessions = async (req, res, next) => {
  try {
    const sessions = await WorkoutSession.find({ userId: req.user._id })
      .populate('workoutPlanId', 'name dayLabel')
      .sort({ startedAt: -1 });

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: { sessions },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single session by ID
 * @route   GET /api/workout-sessions/:id
 * @access  Private
 */
const getSessionById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new ApiError(400, 'Invalid session ID.');
    }

    const session = await WorkoutSession.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate('workoutPlanId', 'name dayLabel targetMuscles estimatedDurationMin');

    if (!session) {
      throw new ApiError(404, 'Session not found.');
    }

    const sets = await WorkoutSessionSet.find({ sessionId: session._id }).populate(
      'exerciseId',
      'name muscleGroup'
    );

    res.status(200).json({
      success: true,
      data: { session, sets },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Finish or cancel a session
 * @route   PATCH /api/workout-sessions/:id/finish
 * @access  Private
 */
const finishSession = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new ApiError(400, 'Invalid session ID.');
    }

    const session = await WorkoutSession.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!session) {
      throw new ApiError(404, 'Session not found.');
    }

    if (session.status !== 'in_progress') {
      throw new ApiError(400, 'Only in-progress sessions can be finished or cancelled.');
    }

    const { status, finishedAt, totalDurationSec, caloriesBurned } = req.body;

    session.status = status;
    session.finishedAt = finishedAt ? new Date(finishedAt) : new Date();
    if (totalDurationSec !== undefined) session.totalDurationSec = totalDurationSec;
    if (caloriesBurned !== undefined) session.caloriesBurned = caloriesBurned;

    await session.save();

    res.status(200).json({
      success: true,
      message: `Workout session ${status}.`,
      data: { session },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Log a set within a session
 * @route   POST /api/workout-sessions/:id/sets
 * @access  Private
 */
const logSet = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new ApiError(400, 'Invalid session ID.');
    }

    const session = await WorkoutSession.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!session) {
      throw new ApiError(404, 'Session not found.');
    }

    if (session.status !== 'in_progress') {
      throw new ApiError(400, 'Sets can only be logged for in-progress sessions.');
    }

    const { exerciseId, setNumber, repsCompleted, restSkipped, completedAt } = req.body;

    const set = await WorkoutSessionSet.create({
      sessionId: session._id,
      exerciseId,
      setNumber,
      repsCompleted,
      restSkipped,
      completedAt: completedAt ? new Date(completedAt) : new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Set logged successfully.',
      data: { set },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all sets for a session
 * @route   GET /api/workout-sessions/:id/sets
 * @access  Private
 */
const getSessionSets = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new ApiError(400, 'Invalid session ID.');
    }

    const session = await WorkoutSession.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!session) {
      throw new ApiError(404, 'Session not found.');
    }

    const sets = await WorkoutSessionSet.find({ sessionId: session._id })
      .populate('exerciseId', 'name muscleGroup')
      .sort({ completedAt: 1 });

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
