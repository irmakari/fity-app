export type TExercise = {
    id: number;
    name: string;
    muscleGroup: string;
    description: string;
    videoUrl: string;
    createdAt: string;
};

export type TWorkoutPlan = {
    id: number;
    name: string;
    dayLabel: string;
    targetMuscles: string;
    estimatedDurationMin: number;
    exerciseCount: number;
    createdAt: string;
};

export type TWorkoutPlanExercise = {
    id: number;
    workoutPlanId: number;
    exerciseId: number;
    sets: number;
    reps: number;
    restSeconds: number;
    orderIndex: number;
};

export type TWorkoutPlanExerciseDetail = {
    id: number;
    name: string;
    muscleGroup: string;
    sets: number;
    reps: number;
    restSeconds: number;
    orderIndex: number;
    isCompleted: boolean;
    hasDiscomfort: boolean;
    statusId?: number;
};

export type TWorkoutPlanDetail = TWorkoutPlan & {
    exercises: TWorkoutPlanExerciseDetail[];
};

export type TWorkoutSession = {
    id: number;
    userId: number;
    workoutPlanId: number;
    status: 'active' | 'completed' | 'cancelled';
    startedAt: string;
    finishedAt: string | null;
    totalDurationSec: number;
    caloriesBurned: number;
};

export type TWorkoutSessionSet = {
    id: number;
    sessionId: number;
    exerciseId: number;
    setNumber: number;
    repsCompleted: number;
    restSkipped: boolean;
    completedAt: string;
};

export type TWorkoutExerciseStatus = {
    id: number;
    userId: number;
    workoutPlanId: number;
    exerciseId: number;
    date: string;
    isCompleted: boolean;
    hasDiscomfort: boolean;
    note: string;
};

export type TStartWorkoutSessionPayload = {
    userId: number;
    workoutPlanId: number;
    status: 'active';
    startedAt: string;
    finishedAt: null;
    totalDurationSec: number;
    caloriesBurned: number;
};

export type TLogWorkoutSetPayload = {
    sessionId: number;
    exerciseId: number;
    setNumber: number;
    repsCompleted: number;
    restSkipped: boolean;
    completedAt: string;
};

export type TLogWorkoutExerciseStatusPayload = {
    userId: number;
    workoutPlanId: number;
    exerciseId: number;
    date: string;
    isCompleted: boolean;
    hasDiscomfort: boolean;
    note: string;
};

export type TFinishWorkoutSessionPayload = {
    status: 'completed';
    finishedAt: string;
    totalDurationSec: number;
    caloriesBurned: number;
};
