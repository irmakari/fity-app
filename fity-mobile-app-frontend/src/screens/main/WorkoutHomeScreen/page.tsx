import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors, typography } from '@/theme';
import { MainStackParamList } from '@/navigation/MainNavigator';
import { WorkoutService } from '@/collections/workout/workout.service';
import { TWorkoutPlan } from '@/collections/workout/workout.type';
import { TodayWorkoutCard } from '@/components/main/TodayWorkoutCard';
import { WorkoutCategoryCard } from '@/components/main/WorkoutCategoryCard';

type TCategory = {
    name: string;
    exerciseCount: number;
    iconName: 'barbell-outline' | 'body-outline' | 'walk-outline' | 'fitness-outline';
    accentColor: string;
};

const CATEGORIES: TCategory[] = [
    { name: 'Chest', exerciseCount: 8, iconName: 'fitness-outline', accentColor: '#EF4444' },
    { name: 'Back', exerciseCount: 8, iconName: 'body-outline', accentColor: '#3B82F6' },
    { name: 'Legs', exerciseCount: 8, iconName: 'walk-outline', accentColor: '#10B981' },
    { name: 'Arms', exerciseCount: 8, iconName: 'barbell-outline', accentColor: '#A855F7' },
];

const WorkoutHomeScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
    const [plans, setPlans] = useState<TWorkoutPlan[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPlans = async () => {
        try {
            setLoading(true);
            const data = await WorkoutService.getAllWorkoutPlans();
            setPlans(data);
        } catch (error) {
            console.error('Error fetching workout plans:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchPlans();
        }, [])
    );

    const todayPlan = plans[0] ?? null;

    const handlePlanPress = (planId: number) => {
        navigation.navigate('WorkoutPlan', { planId });
    };

    const handleStartWorkout = (planId: number) => {
        navigation.navigate('WorkoutPlan', { planId });
    };

    return (
        <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            <Text style={styles.pageTitle}>Workout</Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Today's Plan</Text>

                {loading ? (
                    <View style={styles.loadingWrapper}>
                        <ActivityIndicator size="large" color={colors.primaryButton} />
                    </View>
                ) : todayPlan ? (
                    <TodayWorkoutCard
                        plan={todayPlan}
                        onPress={() => handlePlanPress(todayPlan.id)}
                        onStartWorkout={() => handleStartWorkout(todayPlan.id)}
                    />
                ) : (
                    <Text style={styles.emptyText}>No workout plan for today.</Text>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Explore Workouts</Text>

                <View style={styles.categoryGrid}>
                    {CATEGORIES.map((cat) => (
                        <View key={cat.name} style={styles.categoryCell}>
                            <WorkoutCategoryCard
                                name={cat.name}
                                exerciseCount={cat.exerciseCount}
                                iconName={cat.iconName}
                                accentColor={cat.accentColor}
                                onPress={() => console.log('category:', cat.name)}
                            />
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: colors.background,
    },
    contentContainer: {
        paddingHorizontal: 16,
        paddingTop: 64,
        paddingBottom: 32,
    },
    pageTitle: {
        ...typography.title,
        fontSize: 28,
        lineHeight: 36,
        color: colors.textPrimary,
        marginBottom: 24,
    },
    section: {
        marginBottom: 28,
    },
    sectionTitle: {
        ...typography.title,
        fontSize: 18,
        lineHeight: 26,
        color: colors.textPrimary,
        marginBottom: 12,
    },
    loadingWrapper: {
        paddingVertical: 32,
        alignItems: 'center',
    },
    emptyText: {
        ...typography.input,
        color: colors.textMuted,
        textAlign: 'center',
        paddingVertical: 24,
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    categoryCell: {
        width: '47%',
    },
});

export default WorkoutHomeScreen;
