const { body } = require('express-validator');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

// ============================================================
// VALIDATION RULES
// ============================================================

/**
 * Profile update validation rules.
 */
const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters.'),
  body('age')
    .optional()
    .isInt({ min: 13, max: 120 })
    .withMessage('Age must be between 13 and 120.'),
  body('heightCm')
    .optional()
    .isFloat({ min: 50, max: 300 })
    .withMessage('Height must be between 50 and 300 cm.'),
  body('currentWeightKg')
    .optional()
    .isFloat({ min: 20, max: 500 })
    .withMessage('Weight must be between 20 and 500 kg.'),
  body('targetWeightKg')
    .optional()
    .isFloat({ min: 20, max: 500 })
    .withMessage('Target weight must be between 20 and 500 kg.'),
  body('goalType')
    .optional()
    .isIn(['lose_weight', 'gain_weight', 'build_muscle', 'maintain', 'general_health'])
    .withMessage('Invalid goal type.'),
  body('fitnessLevel')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Invalid fitness level.'),
  body('weeklyWorkoutTarget')
    .optional()
    .isInt({ min: 1, max: 7 })
    .withMessage('Weekly workout target must be between 1 and 7.'),
  body('activityLevel')
    .optional()
    .isIn(['sedentary', 'lightly_active', 'moderately_active', 'active', 'very_active'])
    .withMessage('Invalid activity level.'),
  body('trainingLocation')
    .optional()
    .isIn(['home', 'gym', 'outdoor', 'mixed'])
    .withMessage('Invalid training location.'),
  body('focusMuscles')
    .optional()
    .isArray()
    .withMessage('Focus muscles must be an array.'),
];

/**
 * Notification preferences validation rules.
 */
const updateNotificationsValidation = [
  body('notificationWorkoutReminders')
    .optional()
    .isBoolean()
    .withMessage('Workout reminders must be true or false.'),
  body('notificationWaterReminders')
    .optional()
    .isBoolean()
    .withMessage('Water reminders must be true or false.'),
  body('notificationWeeklyReports')
    .optional()
    .isBoolean()
    .withMessage('Weekly reports must be true or false.'),
];

// ============================================================
// CONTROLLER METHODS
// ============================================================

/**
 * @desc    Get current user's profile
 * @route   GET /api/profile
 * @access  Private
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new ApiError(404, 'User not found.');
    }

    res.status(200).json({
      success: true,
      data: {
        profile: {
          id: user._id,
          name: user.name,
          email: user.email,
          goalType: user.goalType,
        },
        physicalStats: {
          age: user.age,
          heightCm: user.heightCm,
          currentWeightKg: user.currentWeightKg,
          targetWeightKg: user.targetWeightKg,
        },
        goalsAndPreferences: {
          goalType: user.goalType,
          fitnessLevel: user.fitnessLevel,
          weeklyWorkoutTarget: user.weeklyWorkoutTarget,
          activityLevel: user.activityLevel,
          trainingLocation: user.trainingLocation,
          focusMuscles: user.focusMuscles,
        },
        notifications: {
          workoutReminders: user.notificationWorkoutReminders,
          waterReminders: user.notificationWaterReminders,
          weeklyReports: user.notificationWeeklyReports,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update current user's profile
 * @route   PATCH /api/profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    // Only allow these fields to be updated (whitelist)
    const allowedFields = [
      'name',
      'age',
      'heightCm',
      'currentWeightKg',
      'targetWeightKg',
      'goalType',
      'fitnessLevel',
      'weeklyWorkoutTarget',
      'activityLevel',
      'trainingLocation',
      'focusMuscles',
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      throw new ApiError(400, 'No valid fields to update.');
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new ApiError(404, 'User not found.');
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: {
        profile: {
          id: user._id,
          name: user.name,
          email: user.email,
          goalType: user.goalType,
        },
        physicalStats: {
          age: user.age,
          heightCm: user.heightCm,
          currentWeightKg: user.currentWeightKg,
          targetWeightKg: user.targetWeightKg,
        },
        goalsAndPreferences: {
          goalType: user.goalType,
          fitnessLevel: user.fitnessLevel,
          weeklyWorkoutTarget: user.weeklyWorkoutTarget,
          activityLevel: user.activityLevel,
          trainingLocation: user.trainingLocation,
          focusMuscles: user.focusMuscles,
        },
        notifications: {
          workoutReminders: user.notificationWorkoutReminders,
          waterReminders: user.notificationWaterReminders,
          weeklyReports: user.notificationWeeklyReports,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update notification preferences
 * @route   PATCH /api/profile/notifications
 * @access  Private
 */
const updateNotifications = async (req, res, next) => {
  try {
    const allowedFields = [
      'notificationWorkoutReminders',
      'notificationWaterReminders',
      'notificationWeeklyReports',
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      throw new ApiError(400, 'No valid fields to update.');
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new ApiError(404, 'User not found.');
    }

    res.status(200).json({
      success: true,
      message: 'Notification preferences updated successfully.',
      data: {
        notifications: {
          workoutReminders: user.notificationWorkoutReminders,
          waterReminders: user.notificationWaterReminders,
          weeklyReports: user.notificationWeeklyReports,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updateNotifications,
  updateProfileValidation,
  updateNotificationsValidation,
};
