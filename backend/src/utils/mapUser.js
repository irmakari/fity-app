/**
 * Helper to convert Supabase Postgres snake_case user row to camelCase user object.
 */
const mapUser = (row) => {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    age: row.age,
    heightCm: row.height_cm !== null ? Number(row.height_cm) : null,
    currentWeightKg: row.current_weight_kg !== null ? Number(row.current_weight_kg) : null,
    targetWeightKg: row.target_weight_kg !== null ? Number(row.target_weight_kg) : null,
    goalType: row.goal_type,
    fitnessLevel: row.fitness_level,
    weeklyWorkoutTarget: row.weekly_workout_target,
    activityLevel: row.activity_level,
    trainingLocation: row.training_location,
    focusMuscles: row.focus_muscles || [],
    notificationWorkoutReminders: row.notification_workout_reminders ?? true,
    notificationWaterReminders: row.notification_water_reminders ?? true,
    notificationWeeklyReports: row.notification_weekly_reports ?? true,
    isOnboarded: row.is_onboarded ?? false,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

module.exports = { mapUser };
