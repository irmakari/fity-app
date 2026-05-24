const { body, query } = require('express-validator');
const mongoose = require('mongoose');
const WorkoutExerciseStatus = require('../models/WorkoutExerciseStatus');
const ApiError = require('../utils/ApiError');

// ============================================================
// VALIDATION RULES
// ============================================================

const logStatusValidation = [
  body('workoutPlanId')
    .notEmpty()
    .withMessage('Workout plan ID is required.')
    .isMongoId()
    .withMessage('Invalid workout plan ID.'),
  body('exerciseId')
    .notEmpty()
    .withMessage('Exercise ID is required.')
    .isMongoId()
    .withMessage('Invalid exercise ID.'),
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
    .optional()
    .isMongoId()
    .withMessage('Invalid workout plan ID.'),
];

// ============================================================
// CONTROLLER METHODS
// ============================================================

/**
 * @desc    Log exercise status for the authenticated user
 * @route   POST /api/workout-exercise-status
 * @access  Private
 */
const logExerciseStatus = async (req, res, next) => {
  try {
    const { workoutPlanId, exerciseId, date, isCompleted, hasDiscomfort, note } = req.body;

    const normalizedDate = new Date(date);
    normalizedDate.setUTCHours(0, 0, 0, 0);

    // Upsert: one record per user + plan + exercise + day
    const status = await WorkoutExerciseStatus.findOneAndUpdate(
      {
        userId: req.user._id,
        workoutPlanId,
        exerciseId,
        date: normalizedDate,
      },
      {
        userId: req.user._id,
        workoutPlanId,
        exerciseId,
        date: normalizedDate,
        ...(isCompleted !== undefined && { isCompleted }),
        ...(hasDiscomfort !== undefined && { hasDiscomfort }),
        ...(note !== undefined && { note }),
      },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(201).json({
      success: true,
      message: 'Exercise status logged.',
      data: { status },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get exercise statuses for the authenticated user
 * @route   GET /api/workout-exercise-status
 * @access  Private
 * @query   date (ISO date), workoutPlanId
 */
const getExerciseStatuses = async (req, res, next) => {
  try {
    const filter = { userId: req.user._id };

    if (req.query.date) {
      const day = new Date(req.query.date);
      day.setUTCHours(0, 0, 0, 0);
      const nextDay = new Date(day);
      nextDay.setUTCDate(nextDay.getUTCDate() + 1);
      filter.date = { $gte: day, $lt: nextDay };
    }

    if (req.query.workoutPlanId) {
      filter.workoutPlanId = req.query.workoutPlanId;
    }

    const statuses = await WorkoutExerciseStatus.find(filter)
      .populate('exerciseId', 'name muscleGroup')
      .populate('workoutPlanId', 'name dayLabel')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: statuses.length,
      data: { statuses },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an exercise status record
 * @route   PATCH /api/workout-exercise-status/:id
 * @access  Private
 */
const updateExerciseStatus = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new ApiError(400, 'Invalid status ID.');
    }

    const allowedFields = ['isCompleted', 'hasDiscomfort', 'note'];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      throw new ApiError(400, 'No valid fields to update.');
    }

    const status = await WorkoutExerciseStatus.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      updates,
      { new: true, runValidators: true }
    )
      .populate('exerciseId', 'name muscleGroup')
      .populate('workoutPlanId', 'name dayLabel');

    if (!status) {
      throw new ApiError(404, 'Exercise status record not found.');
    }

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
