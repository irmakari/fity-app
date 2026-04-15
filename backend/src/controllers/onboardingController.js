const { body } = require('express-validator');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

// ============================================================
// VALIDATION RULES
// ============================================================

const completeOnboardingValidation = [
  body('goalType')
    .notEmpty()
    .withMessage('Goal type is required.')
    .isIn(['lose_weight', 'gain_weight', 'build_muscle', 'maintain', 'general_health'])
    .withMessage('Invalid goal type.'),
  body('fitnessLevel')
    .notEmpty()
    .withMessage('Fitness level is required.')
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Invalid fitness level.'),
  body('weeklyWorkoutTarget')
    .notEmpty()
    .withMessage('Weekly workout target is required.')
    .isInt({ min: 1, max: 7 })
    .withMessage('Weekly workout target must be between 1 and 7.'),
  body('trainingLocation')
    .notEmpty()
    .withMessage('Training location is required.')
    .isIn(['home', 'gym', 'outdoor', 'mixed'])
    .withMessage('Invalid training location.'),
  body('focusMuscles')
    .notEmpty()
    .withMessage('Focus muscles is required.')
    .isArray({ min: 1 })
    .withMessage('Select at least one muscle group.'),
  body('age')
    .notEmpty()
    .withMessage('Age is required.')
    .isInt({ min: 13, max: 120 })
    .withMessage('Age must be between 13 and 120.'),
  body('heightCm')
    .notEmpty()
    .withMessage('Height is required.')
    .isFloat({ min: 50, max: 300 })
    .withMessage('Height must be between 50 and 300 cm.'),
  body('currentWeightKg')
    .notEmpty()
    .withMessage('Current weight is required.')
    .isFloat({ min: 20, max: 500 })
    .withMessage('Weight must be between 20 and 500 kg.'),
  body('targetWeightKg')
    .notEmpty()
    .withMessage('Target weight is required.')
    .isFloat({ min: 20, max: 500 })
    .withMessage('Target weight must be between 20 and 500 kg.'),
];

// ============================================================
// CONTROLLER METHODS
// ============================================================

/**
 * @desc    Complete onboarding — save all preferences & physical stats
 * @route   POST /api/onboarding/complete
 * @access  Private
 */
const completeOnboarding = async (req, res, next) => {
  try {
    const {
      goalType,
      fitnessLevel,
      weeklyWorkoutTarget,
      trainingLocation,
      focusMuscles,
      age,
      heightCm,
      currentWeightKg,
      targetWeightKg,
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        goalType,
        fitnessLevel,
        weeklyWorkoutTarget,
        trainingLocation,
        focusMuscles,
        age,
        heightCm,
        currentWeightKg,
        targetWeightKg,
        isOnboarded: true,
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new ApiError(404, 'User not found.');
    }

    res.status(200).json({
      success: true,
      message: 'Onboarding completed successfully.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isOnboarded: user.isOnboarded,
        },
        goalsAndPreferences: {
          goalType: user.goalType,
          fitnessLevel: user.fitnessLevel,
          weeklyWorkoutTarget: user.weeklyWorkoutTarget,
          trainingLocation: user.trainingLocation,
          focusMuscles: user.focusMuscles,
        },
        physicalStats: {
          age: user.age,
          heightCm: user.heightCm,
          currentWeightKg: user.currentWeightKg,
          targetWeightKg: user.targetWeightKg,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get onboarding status
 * @route   GET /api/onboarding/status
 * @access  Private
 */
const getOnboardingStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new ApiError(404, 'User not found.');
    }

    res.status(200).json({
      success: true,
      data: {
        isOnboarded: user.isOnboarded,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  completeOnboarding,
  getOnboardingStatus,
  completeOnboardingValidation,
};
