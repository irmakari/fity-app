export const API_ENDPOINTS = {
    auth: {
        login: '/auth/login',
        register: '/auth/register',
    },
    todayPlan: '/workout-plans',
    hydration: {
        today: '/hydration/today',
        hydrationGoals: '/hydration/goals',
        hydrationLogs: '/hydration/logs',
    },
    workout: {
        exercises: '/exercises',
        workoutPlans: '/workout-plans',
        workoutSessions: '/workout-sessions',
        workoutExerciseStatuses: '/workout-exercise-status',
    },
    nutrition: {
        foods: '/foods',
        summary: '/meal-logs/summary',
        mealLogs: '/meal-logs',
    },
};
