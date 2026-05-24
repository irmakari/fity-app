import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import HydrationDetailScreen from '../screens/main/HydrationDetailScreen/page';
import WorkoutPlanScreen from '../screens/main/WorkoutPlanScreen/page';
import ActiveWorkoutSessionScreen from '../screens/main/ActiveWorkoutSessionScreen/page';
import NutritionMealSelectionScreen from '../screens/main/MealSelectionScreen/page';
import NutritionAddFoodScreen from '../screens/main/AddFoodScreen/page';
import TodayWorkoutDetailScreen from '../screens/main/TodayWorkoutDetailScreen/page';
import TodayNutritionDetailScreen from '../screens/main/TodayNutritionDetailScreen/page';
import OnboardingNavigator from '@/navigation/OnboardingNavigator';
import { useOnboarding } from '@/context/OnboardingContext';

export type MainStackParamList = {
    OnboardingFlow: undefined;
    MainTabs: undefined;
    HydrationDetail: undefined;
    WorkoutPlan: { planId: number };
    ActiveWorkoutSession: { planId: number; sessionId: number };
    NutritionMealSelection: undefined;
    NutritionAddFood: { mealType: string };
    TodayWorkoutDetail: { planId?: number } | undefined;
    TodayNutritionDetail: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

const MainNavigator = () => {
    const { shouldShowOnboarding } = useOnboarding();

    return (
        <Stack.Navigator
            initialRouteName={shouldShowOnboarding ? 'OnboardingFlow' : 'MainTabs'}
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="OnboardingFlow" component={OnboardingNavigator} />
            <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
            <Stack.Screen name="HydrationDetail" component={HydrationDetailScreen} />
            <Stack.Screen name="WorkoutPlan" component={WorkoutPlanScreen} />
            <Stack.Screen name="ActiveWorkoutSession" component={ActiveWorkoutSessionScreen} />
            <Stack.Screen name="NutritionMealSelection" component={NutritionMealSelectionScreen} />
            <Stack.Screen name="NutritionAddFood" component={NutritionAddFoodScreen} />
            <Stack.Screen name="TodayWorkoutDetail" component={TodayWorkoutDetailScreen} />
            <Stack.Screen name="TodayNutritionDetail" component={TodayNutritionDetailScreen} />
        </Stack.Navigator>
    );
};

export default MainNavigator;
