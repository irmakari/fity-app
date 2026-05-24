import {
    TOnboardingOption,
    TOnboardingPayload,
    TWorkoutPlanPreviewDay,
} from '@/screens/onboarding/types/onboarding.type';

export const onboardingGoalsMock: TOnboardingOption[] = [
    {
        id: 'lose-weight',
        title: 'Lose Weight',
        description: 'Burn calories with balanced cardio and strength sessions.',
        value: 'lose_weight',
        iconName: 'flame-outline',
    },
    {
        id: 'build-muscle',
        title: 'Build Muscle',
        description: 'Focus on progressive overload and stronger muscle growth.',
        value: 'build_muscle',
        iconName: 'barbell-outline',
    },
    {
        id: 'stay-fit',
        title: 'Stay Fit',
        description: 'Maintain a steady routine for overall health and energy.',
        value: 'stay_fit',
        iconName: 'heart-outline',
    },
    {
        id: 'increase-strength',
        title: 'Increase Strength',
        description: 'Build raw strength with structured compound sessions.',
        value: 'increase_strength',
        iconName: 'flash-outline',
    },
];

export const onboardingFitnessLevelsMock: TOnboardingOption[] = [
    {
        id: 'beginner',
        title: 'Beginner',
        description: 'New to structured workouts and building consistency.',
        value: 'beginner',
        iconName: 'leaf-outline',
    },
    {
        id: 'intermediate',
        title: 'Intermediate',
        description: 'Comfortable with regular training and basic programming.',
        value: 'intermediate',
        iconName: 'trending-up-outline',
    },
    {
        id: 'advanced',
        title: 'Advanced',
        description: 'Experienced with higher training volume and intensity.',
        value: 'advanced',
        iconName: 'trophy-outline',
    },
];

export const onboardingWorkoutDaysMock: TOnboardingOption<number>[] = [
    { id: '3-days', title: '3 Days', value: 3, iconName: 'calendar-outline' },
    { id: '4-days', title: '4 Days', value: 4, iconName: 'calendar-outline' },
    { id: '5-days', title: '5 Days', value: 5, iconName: 'calendar-outline' },
    { id: '6-days', title: '6 Days', value: 6, iconName: 'calendar-outline' },
];

export const onboardingLocationsMock: TOnboardingOption[] = [
    {
        id: 'gym',
        title: 'Gym',
        description: 'Access to full equipment and heavier progressive training.',
        value: 'gym',
        iconName: 'barbell-outline',
    },
    {
        id: 'home-workout',
        title: 'Home Workout',
        description: 'Efficient sessions with bodyweight or minimal equipment.',
        value: 'home_workout',
        iconName: 'home-outline',
    },
    {
        id: 'both',
        title: 'Both',
        description: 'Flexible programming for gym days and home sessions.',
        value: 'both',
        iconName: 'repeat-outline',
    },
];

export const onboardingFocusMusclesMock: TOnboardingOption[] = [
    { id: 'chest', title: 'Chest', value: 'chest', iconName: 'fitness-outline' },
    { id: 'back', title: 'Back', value: 'back', iconName: 'body-outline' },
    { id: 'legs', title: 'Legs', value: 'legs', iconName: 'walk-outline' },
    { id: 'arms', title: 'Arms', value: 'arms', iconName: 'barbell-outline' },
    { id: 'abs', title: 'Abs', value: 'abs', iconName: 'scan-outline' },
    { id: 'full-body', title: 'Full Body', value: 'full_body', iconName: 'sparkles-outline' },
];

const fallbackWorkoutLabels = [
    'Upper Body Strength',
    'Lower Body Power',
    'Full Body Conditioning',
    'Core & Mobility',
    'Push Focus',
    'Pull Focus',
];

const workoutLabelByMuscle: Record<string, string> = {
    chest: 'Chest & Triceps',
    back: 'Back & Biceps',
    legs: 'Legs',
    arms: 'Arms & Shoulders',
    abs: 'Core & Abs',
    full_body: 'Full Body',
};

export const getWorkoutPlanPreview = (
    onboardingPayload: TOnboardingPayload,
): TWorkoutPlanPreviewDay[] => {
    const selectedLabels = onboardingPayload.focusMuscles
        .map((muscle) => workoutLabelByMuscle[muscle])
        .filter(Boolean);

    const uniqueLabels = [...new Set(selectedLabels)];
    const totalDays = onboardingPayload.workoutDays || 3;

    return Array.from({ length: totalDays }).map((_, index) => {
        const label =
            uniqueLabels[index % uniqueLabels.length] ||
            fallbackWorkoutLabels[index % fallbackWorkoutLabels.length];

        return {
            id: `day-${index + 1}`,
            dayLabel: `Day ${index + 1}`,
            workoutLabel: label,
        };
    });
};
