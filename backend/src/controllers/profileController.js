const { body } = require('express-validator');
const { supabase } = require('../config/db');
const { mapUser } = require('../utils/mapUser');
const ApiError = require('../utils/ApiError');

// ============================================================
// VALIDATION RULES
// ============================================================

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

const getProfile = async (req, res, next) => {
  try {
    const { data: userRow, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error || !userRow) {
      throw new ApiError(404, 'User not found.');
    }

    const user = mapUser(userRow);

    res.status(200).json({
      success: true,
      data: {
        profile: {
          id: user.id,
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

const updateProfile = async (req, res, next) => {
  try {
    const fieldMapping = {
      name: 'name',
      age: 'age',
      heightCm: 'height_cm',
      currentWeightKg: 'current_weight_kg',
      targetWeightKg: 'target_weight_kg',
      goalType: 'goal_type',
      fitnessLevel: 'fitness_level',
      weeklyWorkoutTarget: 'weekly_workout_target',
      activityLevel: 'activity_level',
      trainingLocation: 'training_location',
      focusMuscles: 'focus_muscles',
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
      .from('users')
      .update(updates)
      .eq('id', req.user.id)
      .select()
      .single();

    if (error || !updatedRow) {
      throw new ApiError(404, 'User not found or update failed.');
    }

    const user = mapUser(updatedRow);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: {
        profile: {
          id: user.id,
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

const updateNotifications = async (req, res, next) => {
  try {
    const fieldMapping = {
      notificationWorkoutReminders: 'notification_workout_reminders',
      notificationWaterReminders: 'notification_water_reminders',
      notificationWeeklyReports: 'notification_weekly_reports',
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
      .from('users')
      .update(updates)
      .eq('id', req.user.id)
      .select()
      .single();

    if (error || !updatedRow) {
      throw new ApiError(404, 'User not found.');
    }

    const user = mapUser(updatedRow);

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
