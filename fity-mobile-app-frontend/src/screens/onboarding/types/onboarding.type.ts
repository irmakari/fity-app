import { Ionicons } from '@expo/vector-icons';

export type TOnboardingSingleValue = string | number;

export type TOnboardingOption<TValue extends TOnboardingSingleValue = string> = {
    id: string;
    title: string;
    description?: string;
    value: TValue;
    iconName?: keyof typeof Ionicons.glyphMap;
};

export type TOnboardingPhysicalStats = {
    age: number;
    height: number;
    currentWeight: number;
    targetWeight: number;
};

export type TOnboardingPayload = {
    goal: string;
    fitnessLevel: string;
    workoutDays: number;
    trainingLocation: string;
    focusMuscles: string[];
    physicalStats: TOnboardingPhysicalStats;
};

export type TWorkoutPlanPreviewDay = {
    id: string;
    dayLabel: string;
    workoutLabel: string;
};
