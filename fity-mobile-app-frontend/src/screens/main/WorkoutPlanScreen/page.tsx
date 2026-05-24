import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/theme/colors';
import { MainStackParamList } from '@/navigation/MainNavigator';
import { WorkoutService } from '@/collections/workout/workout.service';
import { TWorkoutPlanExerciseDetail } from '@/collections/workout/workout.type';
import { WorkoutFrequencyTabs } from '@/components/main/WorkoutFrequencyTabs';
import { WorkoutDaySelector } from '@/components/main/WorkoutDaySelector';
import { WorkoutPlanSummaryCard } from '@/components/main/WorkoutPlanSummaryCard';
import { WorkoutExerciseCard } from '@/components/main/WorkoutExerciseCard';
import { useAuth } from '@/context/AuthContext';

type WorkoutPlanRouteProp = RouteProp<MainStackParamList, 'WorkoutPlan'>;

const FREQUENCY_OPTIONS = ['3 Days', '4 Days', '5 Days'];

const WEEK_DAYS = [
    { label: 'Mon', date: 5 },
    { label: 'Tue', date: 6 },
    { label: 'Wed', date: 7 },
    { label: 'Thu', date: 8 },
    { label: 'Fri', date: 9 },
];

const WorkoutPlanScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
    const route = useRoute<WorkoutPlanRouteProp>();
    const { planId } = route.params;
    const { user } = useAuth();
    const userId = Number(user?.id) || 1;

    const [loading, setLoading] = useState(true);
    const [starting, setStarting] = useState(false);
    const [planName, setPlanName] = useState('');
    const [dayLabel, setDayLabel] = useState('');
    const [estimatedDurationMin, setEstimatedDurationMin] = useState(0);
    const [exercises, setExercises] = useState<TWorkoutPlanExerciseDetail[]>([]);
    const [activeFrequency, setActiveFrequency] = useState(0);
    const [activeDayIndex, setActiveDayIndex] = useState(1);

    useEffect(() => {
        loadPlan();
    }, []);

    const loadPlan = async () => {
        try {
            setLoading(true);
            const detail = await WorkoutService.getWorkoutPlanById(planId, userId);
            setPlanName(detail.name);
            setDayLabel(detail.dayLabel);
            setEstimatedDurationMin(detail.estimatedDurationMin);
            setExercises(detail.exercises);
        } catch (error) {
            console.error('Error loading workout plan:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleCompleted = async (exerciseId: number) => {
        const exercise = exercises.find((ex) => ex.id === exerciseId);
        if (!exercise) return;

        const newValue = !exercise.isCompleted;
        const today = new Date().toISOString().split('T')[0];

        setExercises((prev) =>
            prev.map((ex) => (ex.id === exerciseId ? { ...ex, isCompleted: newValue } : ex))
        );

        try {
            if (exercise.statusId) {
                // Real API: PATCH /workout-exercise-statuses/:id
                await WorkoutService.updateWorkoutExerciseStatus(exercise.statusId, {
                    isCompleted: newValue,
                });
            } else {
                // Real API: POST /workout-exercise-statuses
                const newStatus = await WorkoutService.logWorkoutExerciseStatus({
                    userId,
                    workoutPlanId: planId,
                    exerciseId,
                    date: today,
                    isCompleted: newValue,
                    hasDiscomfort: exercise.hasDiscomfort,
                    note: '',
                });
                setExercises((prev) =>
                    prev.map((ex) =>
                        ex.id === exerciseId ? { ...ex, statusId: newStatus.id } : ex
                    )
                );
            }
        } catch (error) {
            console.error('Failed to update completion status:', error);
            setExercises((prev) =>
                prev.map((ex) => (ex.id === exerciseId ? { ...ex, isCompleted: !newValue } : ex))
            );
        }
    };

    const handleToggleDiscomfort = async (exerciseId: number) => {
        const exercise = exercises.find((ex) => ex.id === exerciseId);
        if (!exercise) return;

        const newValue = !exercise.hasDiscomfort;
        const today = new Date().toISOString().split('T')[0];

        setExercises((prev) =>
            prev.map((ex) => (ex.id === exerciseId ? { ...ex, hasDiscomfort: newValue } : ex))
        );

        try {
            if (exercise.statusId) {
                // Real API: PATCH /workout-exercise-statuses/:id
                await WorkoutService.updateWorkoutExerciseStatus(exercise.statusId, {
                    hasDiscomfort: newValue,
                });
            } else {
                // Real API: POST /workout-exercise-statuses
                const newStatus = await WorkoutService.logWorkoutExerciseStatus({
                    userId,
                    workoutPlanId: planId,
                    exerciseId,
                    date: today,
                    isCompleted: exercise.isCompleted,
                    hasDiscomfort: newValue,
                    note: '',
                });
                setExercises((prev) =>
                    prev.map((ex) =>
                        ex.id === exerciseId ? { ...ex, statusId: newStatus.id } : ex
                    )
                );
            }
        } catch (error) {
            console.error('Failed to update discomfort status:', error);
            setExercises((prev) =>
                prev.map((ex) =>
                    ex.id === exerciseId ? { ...ex, hasDiscomfort: !newValue } : ex
                )
            );
        }
    };

    const handleStartWorkout = async () => {
        try {
            setStarting(true);
            // Real API: POST /workout-sessions/start
            const session = await WorkoutService.startWorkoutSession({
                userId,
                workoutPlanId: planId,
                status: 'active',
                startedAt: new Date().toISOString(),
                finishedAt: null,
                totalDurationSec: 0,
                caloriesBurned: 0,
            });
            navigation.navigate('ActiveWorkoutSession', {
                planId,
                sessionId: session.id,
            });
        } catch (error) {
            console.error('Failed to start workout session:', error);
        } finally {
            setStarting(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color={colors.primaryButton} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.75}
                    >
                        <Ionicons name="chevron-back" size={26} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Workout Plan</Text>
                    <View style={styles.headerRight}>
                        <Ionicons name="options-outline" size={22} color={colors.textSecondary} />
                    </View>
                </View>

                <View style={styles.body}>
                    <WorkoutFrequencyTabs
                        options={FREQUENCY_OPTIONS}
                        activeIndex={activeFrequency}
                        onSelect={setActiveFrequency}
                    />

                    <WorkoutDaySelector
                        days={WEEK_DAYS}
                        activeDayIndex={activeDayIndex}
                        onSelect={setActiveDayIndex}
                    />

                    <WorkoutPlanSummaryCard
                        name={planName}
                        dayLabel={dayLabel}
                        estimatedDurationMin={estimatedDurationMin}
                        exerciseCount={exercises.length}
                    />

                    <Text style={styles.exercisesTitle}>Exercises</Text>

                    <View style={styles.exerciseList}>
                        {exercises.map((exercise) => (
                            <WorkoutExerciseCard
                                key={exercise.id}
                                exercise={exercise}
                                onToggleCompleted={() => handleToggleCompleted(exercise.id)}
                                onToggleDiscomfort={() => handleToggleDiscomfort(exercise.id)}
                            />
                        ))}
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.startButton, starting && styles.startButtonDisabled]}
                    onPress={handleStartWorkout}
                    disabled={starting}
                    activeOpacity={0.85}
                >
                    {starting ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <>
                            <Ionicons name="play" size={18} color="#FFFFFF" />
                            <Text style={styles.startButtonText}>Start Workout</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingBottom: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: colors.background,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    headerRight: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    body: {
        paddingHorizontal: 16,
        gap: 16,
    },
    exercisesTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: colors.textPrimary,
        marginTop: 4,
    },
    exerciseList: {
        gap: 12,
    },
    footer: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    startButton: {
        backgroundColor: colors.primaryButton,
        borderRadius: 16,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    startButtonDisabled: {
        opacity: 0.6,
    },
    startButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default WorkoutPlanScreen;
