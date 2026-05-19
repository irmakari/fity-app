import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GoalSelectionScreen from '@/screens/onboarding/GoalSelectionScreen/page';
import FitnessLevelScreen from '@/screens/onboarding/FitnessLevelScreen/page';
import WorkoutFrequencyScreen from '@/screens/onboarding/WorkoutFrequencyScreen/page';
import TrainingLocationScreen from '@/screens/onboarding/TrainingLocationScreen/page';
import FocusMuscleScreen from '@/screens/onboarding/FocusMuscleScreen/page';
import PhysicalStatsScreen from '@/screens/onboarding/PhysicalStatsScreen/page';
import WorkoutPlanReadyScreen from '@/screens/onboarding/WorkoutPlanReadyScreen/page';

export type OnboardingStackParamList = {
    GoalSelection: undefined;
    FitnessLevel: undefined;
    WorkoutFrequency: undefined;
    TrainingLocation: undefined;
    FocusMuscle: undefined;
    PhysicalStats: undefined;
    WorkoutPlanReady: undefined;
};

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

const OnboardingNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="GoalSelection"
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen name="GoalSelection" component={GoalSelectionScreen} />
            <Stack.Screen name="FitnessLevel" component={FitnessLevelScreen} />
            <Stack.Screen name="WorkoutFrequency" component={WorkoutFrequencyScreen} />
            <Stack.Screen name="TrainingLocation" component={TrainingLocationScreen} />
            <Stack.Screen name="FocusMuscle" component={FocusMuscleScreen} />
            <Stack.Screen name="PhysicalStats" component={PhysicalStatsScreen} />
            <Stack.Screen name="WorkoutPlanReady" component={WorkoutPlanReadyScreen} />
        </Stack.Navigator>
    );
};

export default OnboardingNavigator;
