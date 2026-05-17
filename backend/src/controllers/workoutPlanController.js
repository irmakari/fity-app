const { body } = require('express-validator');
const mongoose = require('mongoose');
const WorkoutPlan = require('../models/WorkoutPlan');
const ApiError = require('../utils/ApiError');

// ============================================================
// VALIDATION RULES
// ============================================================

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
    .withMessage('Exercise ID is required.')
    .isMongoId()
    .withMessage('Invalid exercise ID.'),
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
    .withMessage('Exercise ID is required.')
    .isMongoId()
    .withMessage('Invalid exercise ID.'),
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

// ============================================================
// CONTROLLER METHODS
// ============================================================

/**
 * @desc    Get all workout plans
 * @route   GET /api/workout-plans
 * @access  Private
 */
const getWorkoutPlans = async (req, res, next) => {
  try {
    const plans = await WorkoutPlan.find()
      .populate('exercises.exerciseId', 'name muscleGroup description videoUrl')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: plans.length,
      data: { plans },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single workout plan by ID
 * @route   GET /api/workout-plans/:id
 * @access  Private
 */
const getWorkoutPlanById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new ApiError(400, 'Invalid workout plan ID.');
    }

    const plan = await WorkoutPlan.findById(req.params.id).populate(
      'exercises.exerciseId',
      'name muscleGroup description videoUrl'
    );

    if (!plan) {
      throw new ApiError(404, 'Workout plan not found.');
    }

    res.status(200).json({
      success: true,
      data: { plan },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new workout plan
 * @route   POST /api/workout-plans
 * @access  Private
 */
const createWorkoutPlan = async (req, res, next) => {
  try {
    const { name, dayLabel, targetMuscles, estimatedDurationMin, exercises } = req.body;

    const plan = await WorkoutPlan.create({
      name,
      dayLabel,
      targetMuscles,
      estimatedDurationMin,
      exercises: exercises || [],
    });

    const populated = await plan.populate(
      'exercises.exerciseId',
      'name muscleGroup description videoUrl'
    );

    res.status(201).json({
      success: true,
      message: 'Workout plan created successfully.',
      data: { plan: populated },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a workout plan
 * @route   PATCH /api/workout-plans/:id
 * @access  Private
 */
const updateWorkoutPlan = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new ApiError(400, 'Invalid workout plan ID.');
    }

    const allowedFields = ['name', 'dayLabel', 'targetMuscles', 'estimatedDurationMin', 'exercises'];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      throw new ApiError(400, 'No valid fields to update.');
    }

    const plan = await WorkoutPlan.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate('exercises.exerciseId', 'name muscleGroup description videoUrl');

    if (!plan) {
      throw new ApiError(404, 'Workout plan not found.');
    }

    res.status(200).json({
      success: true,
      message: 'Workout plan updated successfully.',
      data: { plan },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a workout plan
 * @route   DELETE /api/workout-plans/:id
 * @access  Private
 */
const deleteWorkoutPlan = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new ApiError(400, 'Invalid workout plan ID.');
    }

    const plan = await WorkoutPlan.findByIdAndDelete(req.params.id);

    if (!plan) {
      throw new ApiError(404, 'Workout plan not found.');
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
