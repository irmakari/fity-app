const { body } = require('express-validator');
const { supabase } = require('../config/db');
const { mapUser } = require('../utils/mapUser');
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

    const { data: updatedRow, error } = await supabase
      .from('users')
      .update({
        goal_type: goalType,
        fitness_level: fitnessLevel,
        weekly_workout_target: weeklyWorkoutTarget,
        training_location: trainingLocation,
        focus_muscles: focusMuscles,
        age,
        height_cm: heightCm,
        current_weight_kg: currentWeightKg,
        target_weight_kg: targetWeightKg,
        is_onboarded: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', req.user.id)
      .select()
      .single();

    if (error || !updatedRow) {
      throw new ApiError(404, 'User not found or update failed.');
    }

    const user = mapUser(updatedRow);

    res.status(200).json({
      success: true,
      message: 'Onboarding completed successfully.',
      data: {
        user: {
          id: user.id,
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

const getOnboardingStatus = async (req, res, next) => {
  try {
    const { data: userRow, error } = await supabase
      .from('users')
      .select('is_onboarded')
      .eq('id', req.user.id)
      .single();

    if (error || !userRow) {
      throw new ApiError(404, 'User not found.');
    }

    res.status(200).json({
      success: true,
      data: {
        isOnboarded: userRow.is_onboarded ?? false,
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
