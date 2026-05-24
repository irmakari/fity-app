export type TTodayPlanHydration = {
    title: string;
    current: number;
    target: number;
    unit: string;
    progress: number;
};

export type TTodayPlanWorkout = {
    workoutPlanId: string;
    title: string;
    completedMinutes: number;
    totalMinutes: number;
    remainingExercises: number;
    progress: number;
};

export type TTodayPlanNutrition = {
    title: string;
    currentCalories: number;
    targetCalories: number;
    progress: number;
};

export type TTodayPlan = {
    id: string;
    userId: number;
    hydration: TTodayPlanHydration;
    workout: TTodayPlanWorkout;
    nutrition: TTodayPlanNutrition;
};
