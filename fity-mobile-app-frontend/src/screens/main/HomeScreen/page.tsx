import React, { useState, useCallback } from 'react';
import { View, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { PlanProgressCard } from '@/components/main/PlanProgressCard';
import { globalStyles } from '@/theme';
import { HomeGreetingHeader } from '@/components/main/HomeGreetingHeader';
import { AskAiCard } from '@/components/main/AskAiCard';
import { MainStackParamList } from '@/navigation/MainNavigator';
import { HydrationService } from '@/collections/hydration/hydration.service';
import { NutritionService } from '@/collections/nutrition/nutrition.service';
import { TodayPlanService } from '@/collections/todayPlan/todayPlan.service';
import { TTodayPlan } from '@/collections/todayPlan/todayPlan.type';
import { useAuth } from '@/context/AuthContext';

const HomeScreenPage = () => {
    const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
    const { user, logout } = useAuth();
    const userId = Number(user?.id) || 1;

    const [hydrationData, setHydrationData] = useState({
        current: 0,
        goal: 2000,
        progress: 0,
        logCount: 0,
    });
    const [nutritionMealCount, setNutritionMealCount] = useState(0);
    const [todayPlan, setTodayPlan] = useState<TTodayPlan | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [goalData, logsData, planData, mealsData] = await Promise.all([
                HydrationService.getGoal(userId),
                HydrationService.getLogs(userId),
                TodayPlanService.getTodayPlan(userId),
                NutritionService.getMeals(String(userId)),
            ]);

            const total = logsData.reduce((acc, log) => acc + log.amountMl, 0);
            const goal = goalData?.dailyGoalMl || 2000;
            setHydrationData({
                current: total,
                goal,
                progress: Math.min(total / goal, 1),
                logCount: logsData.length,
            });
            setTodayPlan(planData);
            setNutritionMealCount(mealsData.length);
        } catch (error) {
            console.error('Error fetching home data:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(useCallback(() => { fetchData(); }, []));

    const workout = todayPlan?.workout;
    const nutrition = todayPlan?.nutrition;
    const hydrationRemaining = Math.max(hydrationData.goal - hydrationData.current, 0);
    const workoutPlanId = Number(workout?.workoutPlanId);

    return (
        <View style={globalStyles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#1e88e5" style={{ marginTop: 32 }} />
            ) : (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 24, gap: 16 }}
                >
                    <HomeGreetingHeader
                        userName={user?.name || 'User'}
                        onProfilePress={() => console.log('profile')}
                        onLogoutPress={logout}
                    />

                    <PlanProgressCard
                        title="Hydration"
                        value={`${hydrationData.current / 1000} L / ${hydrationData.goal / 1000} L`}
                        subtitle={
                            hydrationRemaining > 0
                                ? `${(hydrationRemaining / 1000).toFixed(1)} L left to hit today’s target`
                                : 'Daily target reached, keep the streak going'
                        }
                        insight={`${hydrationData.logCount} water log${hydrationData.logCount === 1 ? '' : 's'} added today`}
                        actionLabel="Open tracker"
                        progress={hydrationData.progress}
                        accentColor="#60A5FA"
                        iconName="water-outline"
                        onPress={() => navigation.navigate('HydrationDetail')}
                    />

                    <PlanProgressCard
                        title={workout?.title ?? 'Today’s Workout'}
                        value={
                            workout
                                ? `${workout.completedMinutes} min / ${workout.totalMinutes} min`
                                : 'No active workout yet'
                        }
                        subtitle={
                            workout
                                ? workout.remainingExercises
                                    ? `${workout.remainingExercises} exercises remaining`
                                    : 'All planned exercises completed today'
                                : 'Browse today’s plan and start your session'
                        }
                        insight={
                            workout
                                ? `Today’s split is ${workout.title.toLowerCase()}`
                                : 'Go to the workout page to pick a session'
                        }
                        actionLabel={workout ? 'Open detail' : 'Go to workout'}
                        progress={workout?.progress ?? 0}
                        accentColor="#A855F7"
                        iconName="barbell-outline"
                        onPress={() => {
                            navigation.navigate(
                                'TodayWorkoutDetail',
                                workoutPlanId ? { planId: workoutPlanId } : undefined,
                            );
                        }}
                    />

                    <PlanProgressCard
                        title={nutrition?.title ?? 'Nutrition'}
                        value={`${nutrition?.currentCalories ?? 0} / ${nutrition?.targetCalories ?? 0} kcal`}
                        subtitle={
                            nutritionMealCount
                                ? `${nutritionMealCount} meal${nutritionMealCount === 1 ? '' : 's'} logged today`
                                : 'No meals logged yet, start tracking your intake'
                        }
                        insight={
                            nutrition
                                ? `${Math.max((nutrition.targetCalories - nutrition.currentCalories), 0)} kcal remaining for today`
                                : 'Open the nutrition log to track meals'
                        }
                        actionLabel="Open log"
                        progress={nutrition?.progress ?? 0}
                        accentColor="#EF4444"
                        iconName="nutrition-outline"
                        onPress={() => navigation.navigate('TodayNutritionDetail')}
                    />

                    <AskAiCard
                        title="Ask AI"
                        description="Your personal health coach can help you stay on track today."
                        onPress={() => console.log('ask ai')}
                    />
                </ScrollView>
            )}
        </View>
    );
};

export default HomeScreenPage;
