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

import { colors, typography } from '@/theme';
import { MainStackParamList } from '@/navigation/MainNavigator';
import { WorkoutService } from '@/collections/workout/workout.service';
import { TWorkoutPlanDetail, TWorkoutPlanExerciseDetail } from '@/collections/workout/workout.type';
import { useAuth } from '@/context/AuthContext';
import { TodayPlanService } from '@/collections/todayPlan/todayPlan.service';

type TodayWorkoutDetailRouteProp = RouteProp<MainStackParamList, 'TodayWorkoutDetail'>;

const WORKOUT_COLOR = '#A855F7';

const TodayWorkoutDetailScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
    const route = useRoute<TodayWorkoutDetailRouteProp>();
    const planId = route.params?.planId;
    const { user } = useAuth();
    const userId = Number(user?.id) || 1;

    const [loading, setLoading] = useState(true);
    const [plan, setPlan] = useState<TWorkoutPlanDetail | null>(null);
    const [resolvedPlanId, setResolvedPlanId] = useState<number | null>(null);

    useEffect(() => {
        const loadPlan = async () => {
            try {
                setLoading(true);

                const resolvedPlanId =
                    planId ??
                    Number((await TodayPlanService.getTodayPlan(userId))?.workout?.workoutPlanId);

                if (!resolvedPlanId) {
                    setPlan(null);
                    setResolvedPlanId(null);
                    return;
                }

                const workoutPlan = await WorkoutService.getWorkoutPlanById(resolvedPlanId, userId);
                setResolvedPlanId(resolvedPlanId);
                setPlan(workoutPlan);
            } catch (err) {
                console.error('Error loading workout plan:', err);
                setPlan(null);
                setResolvedPlanId(null);
            } finally {
                setLoading(false);
            }
        };

        loadPlan();
    }, [planId, userId]);

    const handleToggleCompleted = async (exercise: TWorkoutPlanExerciseDetail) => {
        if (!plan || !resolvedPlanId) return;
        const newValue = !exercise.isCompleted;
        const today = new Date().toISOString().split('T')[0];

        setPlan((prev) =>
            prev
                ? {
                      ...prev,
                      exercises: prev.exercises.map((ex) =>
                          ex.id === exercise.id ? { ...ex, isCompleted: newValue } : ex
                      ),
                  }
                : prev
        );

        try {
            if (exercise.statusId) {
                await WorkoutService.updateWorkoutExerciseStatus(exercise.statusId, {
                    isCompleted: newValue,
                });
            } else {
                const newStatus = await WorkoutService.logWorkoutExerciseStatus({
                    userId,
                    workoutPlanId: resolvedPlanId,
                    exerciseId: exercise.id,
                    date: today,
                    isCompleted: newValue,
                    hasDiscomfort: exercise.hasDiscomfort,
                    note: '',
                });
                setPlan((prev) =>
                    prev
                        ? {
                              ...prev,
                              exercises: prev.exercises.map((ex) =>
                                  ex.id === exercise.id ? { ...ex, statusId: newStatus.id } : ex
                              ),
                          }
                        : prev
                );
            }
        } catch (err) {
            console.error('Failed to update completion status:', err);
            setPlan((prev) =>
                prev
                    ? {
                          ...prev,
                          exercises: prev.exercises.map((ex) =>
                              ex.id === exercise.id ? { ...ex, isCompleted: !newValue } : ex
                          ),
                      }
                    : prev
            );
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color={colors.primaryButton} />
            </View>
        );
    }

    if (!plan) {
        return (
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="chevron-back" size={28} color={colors.textPrimary} />
                        </TouchableOpacity>
                        <View style={styles.headerCenter}>
                            <Text style={styles.headerTitle}>Today&apos;s Workout</Text>
                            <Text style={styles.headerSubtitle}>Daily tracking overview</Text>
                        </View>
                        <View style={{ width: 40 }} />
                    </View>

                    <View style={styles.summaryCard}>
                        <Text style={styles.planName}>No workout logged yet</Text>
                        <Text style={styles.planMuscles}>
                            Start a session from the Workout tab to see today&apos;s tracking here.
                        </Text>

                        <View style={styles.trackingGrid}>
                            <View style={styles.trackingCard}>
                                <Text style={styles.trackingValue}>0</Text>
                                <Text style={styles.trackingLabel}>Completed</Text>
                            </View>
                            <View style={styles.trackingCard}>
                                <Text style={styles.trackingValue}>0</Text>
                                <Text style={styles.trackingLabel}>Remaining</Text>
                            </View>
                            <View style={styles.trackingCard}>
                                <Text style={styles.trackingValue}>0</Text>
                                <Text style={styles.trackingLabel}>Min left</Text>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.openWorkoutButton}
                        onPress={() => (navigation as any).navigate('MainTabs', { screen: 'Workout' })}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.openWorkoutButtonText}>Go To Workout Tab</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }

    const completedCount = plan.exercises.filter((ex) => ex.isCompleted).length;
    const totalCount = plan.exercises.length;
    const progress = totalCount > 0 ? completedCount / totalCount : 0;
    const remainingCount = Math.max(totalCount - completedCount, 0);
    const estimatedMinutesLeft = Math.max(
        Math.round(plan.estimatedDurationMin * (1 - progress)),
        0,
    );

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="chevron-back" size={28} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <Text style={styles.headerTitle}>Today's Workout</Text>
                        <Text style={styles.headerSubtitle}>{plan.dayLabel}</Text>
                    </View>
                    <View style={{ width: 40 }} />
                </View>

                {/* Plan Summary Card */}
                <View style={styles.summaryCard}>
                    <Text style={styles.planName}>{plan.name}</Text>
                    <Text style={styles.planMuscles}>{plan.targetMuscles}</Text>

                    <View style={styles.statsRow}>
                        <View style={styles.stat}>
                            <Ionicons name="time-outline" size={18} color={WORKOUT_COLOR} />
                            <Text style={styles.statValue}>{plan.estimatedDurationMin} min</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.stat}>
                            <Ionicons name="barbell-outline" size={18} color={WORKOUT_COLOR} />
                            <Text style={styles.statValue}>{totalCount} exercises</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.stat}>
                            <Ionicons name="checkmark-circle-outline" size={18} color={colors.success} />
                            <Text style={styles.statValue}>{completedCount} done</Text>
                        </View>
                    </View>

                    <View style={styles.progressTrack}>
                        <View
                            style={[styles.progressFill, { width: `${progress * 100}%` }]}
                        />
                    </View>
                    <Text style={styles.progressLabel}>
                        {Math.round(progress * 100)}% completed
                    </Text>
                </View>

                <View style={styles.summaryCard}>
                    <Text style={styles.sectionTitle}>Daily Tracking</Text>

                    <View style={styles.trackingGrid}>
                        <View style={styles.trackingCard}>
                            <Text style={styles.trackingValue}>{completedCount}</Text>
                            <Text style={styles.trackingLabel}>Completed</Text>
                        </View>
                        <View style={styles.trackingCard}>
                            <Text style={styles.trackingValue}>{remainingCount}</Text>
                            <Text style={styles.trackingLabel}>Remaining</Text>
                        </View>
                        <View style={styles.trackingCard}>
                            <Text style={styles.trackingValue}>{estimatedMinutesLeft}</Text>
                            <Text style={styles.trackingLabel}>Min left</Text>
                        </View>
                    </View>
                </View>

                {/* Exercises */}
                <Text style={styles.sectionTitle}>Exercises</Text>

                <View style={styles.exerciseList}>
                    {plan.exercises.map((exercise) => (
                        <View
                            key={exercise.id}
                            style={[
                                styles.exerciseCard,
                                exercise.isCompleted && styles.exerciseCardCompleted,
                            ]}
                        >
                            <View style={styles.exerciseLeft}>
                                <View
                                    style={[
                                        styles.exerciseIndex,
                                        exercise.isCompleted && { backgroundColor: `${WORKOUT_COLOR}18` },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.exerciseIndexText,
                                            exercise.isCompleted && { color: WORKOUT_COLOR },
                                        ]}
                                    >
                                        {exercise.orderIndex}
                                    </Text>
                                </View>

                                <View style={styles.exerciseInfo}>
                                    <Text
                                        style={[
                                            styles.exerciseName,
                                            exercise.isCompleted && styles.exerciseNameCompleted,
                                        ]}
                                    >
                                        {exercise.name}
                                    </Text>
                                    <Text style={styles.exerciseMuscle}>{exercise.muscleGroup}</Text>
                                    <View style={styles.exerciseMetaRow}>
                                        <Text style={styles.exerciseMeta}>
                                            {exercise.sets} sets × {exercise.reps} reps
                                        </Text>
                                        <Text style={styles.exerciseMetaDot}> · </Text>
                                        <Text style={styles.exerciseMeta}>
                                            {exercise.restSeconds}s rest
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={[
                                    styles.checkButton,
                                    exercise.isCompleted && styles.checkButtonActive,
                                ]}
                                onPress={() => handleToggleCompleted(exercise)}
                                activeOpacity={0.75}
                            >
                                <Ionicons
                                    name={exercise.isCompleted ? 'checkmark' : 'checkmark-outline'}
                                    size={20}
                                    color={exercise.isCompleted ? colors.surface : colors.textMuted}
                                />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    centered: { justifyContent: 'center', alignItems: 'center' },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 64,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 24,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.borderSoft,
        shadowColor: colors.shadow,
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        elevation: 2,
    },
    headerCenter: { alignItems: 'center' },
    headerTitle: {
        ...typography.title,
        fontSize: 22,
        lineHeight: 30,
        color: colors.textPrimary,
    },
    headerSubtitle: {
        ...typography.helperText,
        fontSize: 13,
        color: colors.textSecondary,
        marginTop: 2,
    },
    summaryCard: {
        backgroundColor: colors.surface,
        borderRadius: 24,
        padding: 20,
        marginBottom: 24,
        gap: 12,
        borderWidth: 1,
        borderColor: colors.borderSoft,
        shadowColor: colors.shadow,
        shadowOpacity: 0.06,
        shadowRadius: 14,
        shadowOffset: {
            width: 0,
            height: 6,
        },
        elevation: 3,
    },
    planName: {
        ...typography.title,
        fontSize: 20,
        lineHeight: 28,
        color: colors.textPrimary,
    },
    planMuscles: {
        ...typography.helperText,
        fontSize: 13,
        color: colors.textSecondary,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    stat: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    statValue: {
        ...typography.helperText,
        fontSize: 13,
        color: colors.textPrimary,
    },
    statDivider: {
        width: 1,
        height: 20,
        backgroundColor: '#E6ECF2',
    },
    progressTrack: {
        height: 10,
        borderRadius: 999,
        backgroundColor: '#E7EDF3',
        overflow: 'hidden',
        marginTop: 4,
    },
    progressFill: {
        height: '100%',
        borderRadius: 999,
        backgroundColor: WORKOUT_COLOR,
    },
    progressLabel: {
        ...typography.helperText,
        fontSize: 12,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    sectionTitle: {
        ...typography.label,
        fontSize: 17,
        color: colors.textPrimary,
        marginBottom: 12,
    },
    trackingGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    trackingCard: {
        flex: 1,
        backgroundColor: colors.surfaceMuted,
        borderRadius: 18,
        paddingVertical: 16,
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    trackingValue: {
        ...typography.title,
        fontSize: 20,
        lineHeight: 28,
        color: colors.textPrimary,
        marginBottom: 4,
    },
    trackingLabel: {
        ...typography.helperText,
        fontSize: 11,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    exerciseList: { gap: 10 },
    exerciseCard: {
        backgroundColor: colors.surface,
        borderRadius: 22,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: colors.borderSoft,
        shadowColor: colors.shadow,
        shadowOpacity: 0.05,
        shadowRadius: 12,
        shadowOffset: {
            width: 0,
            height: 6,
        },
        elevation: 2,
    },
    exerciseCardCompleted: {
        opacity: 0.7,
    },
    exerciseLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    exerciseIndex: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: colors.surfaceMuted,
        alignItems: 'center',
        justifyContent: 'center',
    },
    exerciseIndexText: {
        ...typography.link,
        color: colors.textSecondary,
    },
    exerciseInfo: { flex: 1, gap: 2 },
    exerciseName: {
        ...typography.label,
        fontSize: 15,
        color: colors.textPrimary,
    },
    exerciseNameCompleted: {
        textDecorationLine: 'line-through',
        color: colors.textSecondary,
    },
    exerciseMuscle: {
        ...typography.helperText,
        fontSize: 12,
        color: colors.textMuted,
    },
    exerciseMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    exerciseMeta: {
        ...typography.helperText,
        fontSize: 12,
        color: colors.textSecondary,
    },
    exerciseMetaDot: {
        ...typography.helperText,
        fontSize: 12,
        color: colors.textMuted,
    },
    checkButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1.5,
        borderColor: colors.borderSoft,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 12,
        backgroundColor: colors.surface,
    },
    checkButtonActive: {
        backgroundColor: WORKOUT_COLOR,
        borderColor: WORKOUT_COLOR,
    },
    emptyText: {
        ...typography.input,
        color: colors.textMuted,
    },
    openWorkoutButton: {
        backgroundColor: colors.primaryButton,
        borderRadius: 18,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.shadow,
        shadowOpacity: 0.12,
        shadowRadius: 16,
        shadowOffset: {
            width: 0,
            height: 10,
        },
        elevation: 4,
    },
    openWorkoutButtonText: {
        ...typography.button,
        color: colors.surface,
    },
});

export default TodayWorkoutDetailScreen;
