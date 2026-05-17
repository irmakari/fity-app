const { body } = require('express-validator');
const mongoose = require('mongoose');
const Exercise = require('../models/Exercise');
const ApiError = require('../utils/ApiError');

// ============================================================
// VALIDATION RULES
// ============================================================

const createExerciseValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Exercise name is required.')
    .isLength({ max: 100 })
    .withMessage('Exercise name must be at most 100 characters.'),
  body('muscleGroup')
    .trim()
    .notEmpty()
    .withMessage('Muscle group is required.'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be at most 1000 characters.'),
  body('videoUrl')
    .optional()
    .trim(),
];

// ============================================================
// CONTROLLER METHODS
// ============================================================

/**
 * @desc    Get all exercises
 * @route   GET /api/exercises
 * @access  Private
 */
const getExercises = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.muscleGroup) {
      filter.muscleGroup = req.query.muscleGroup;
    }

    const exercises = await Exercise.find(filter).sort({ muscleGroup: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: exercises.length,
      data: { exercises },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single exercise by ID
 * @route   GET /api/exercises/:id
 * @access  Private
 */
const getExerciseById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new ApiError(400, 'Invalid exercise ID.');
    }

    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      throw new ApiError(404, 'Exercise not found.');
    }

    res.status(200).json({
      success: true,
      data: { exercise },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new exercise
 * @route   POST /api/exercises
 * @access  Private
 */
const createExercise = async (req, res, next) => {
  try {
    const { name, muscleGroup, description, videoUrl } = req.body;

    const exercise = await Exercise.create({ name, muscleGroup, description, videoUrl });

    res.status(201).json({
      success: true,
      message: 'Exercise created successfully.',
      data: { exercise },
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
};
