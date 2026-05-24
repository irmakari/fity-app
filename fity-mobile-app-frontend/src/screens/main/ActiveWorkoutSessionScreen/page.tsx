import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors, typography } from '@/theme';
import { MainStackParamList } from '@/navigation/MainNavigator';
import { WorkoutService } from '@/collections/workout/workout.service';
import { TWorkoutPlanExerciseDetail } from '@/collections/workout/workout.type';
import { WorkoutSessionHeader } from '@/components/main/WorkoutSessionHeader';
import { ExerciseSetDisplay } from '@/components/main/ExerciseSetDisplay';
import { RestTimerCard } from '@/components/main/RestTimerCard';
import { WorkoutProgressBar } from '@/components/main/WorkoutProgressBar';

type ActiveWorkoutSessionRouteProp = RouteProp<MainStackParamList, 'ActiveWorkoutSession'>;

const ActiveWorkoutSessionScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
    const route = useRoute<ActiveWorkoutSessionRouteProp>();
    const { planId, sessionId } = route.params;

    const [loading, setLoading] = useState(true);
    const [exercises, setExercises] = useState<TWorkoutPlanExerciseDetail[]>([]);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [currentSet, setCurrentSet] = useState(1);
    const [isResting, setIsResting] = useState(false);
    const [restTimeLeft, setRestTimeLeft] = useState(0);
    const [elapsed, setElapsed] = useState(0);
    const [completedExercises, setCompletedExercises] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        loadExercises();
    }, []);

    // Global elapsed timer
    useEffect(() => {
        const interval = setInterval(() => setElapsed((prev) => prev + 1), 1000);
        return () => clearInterval(interval);
    }, []);

    // Rest countdown
    useEffect(() => {
        if (!isResting || restTimeLeft <= 0) return;
        const timer = setTimeout(() => setRestTimeLeft((prev) => prev - 1), 1000);
        return () => clearTimeout(timer);
    }, [isResting, restTimeLeft]);

    useEffect(() => {
        if (isResting && restTimeLeft === 0) {
            setIsResting(false);
        }
    }, [isResting, restTimeLeft]);

    const loadExercises = async () => {
        try {
            setLoading(true);
            const detail = await WorkoutService.getWorkoutPlanById(planId);
            setExercises(detail.exercises);
        } catch (error) {
            console.error('Error loading exercises for session:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteSet = useCallback(async () => {
        const currentExercise = exercises[currentExerciseIndex];
        if (!currentExercise) return;

        // Real API: log the completed set
        // await WorkoutService.logWorkoutSet({
        //     sessionId,
        //     exerciseId: currentExercise.id,
        //     setNumber: currentSet,
        //     repsCompleted: currentExercise.reps,
        //     restSkipped: false,
        //     completedAt: new Date().toISOString(),
        // });

        if (currentSet < currentExercise.sets) {
            setCurrentSet((prev) => prev + 1);
            setIsResting(true);
            setRestTimeLeft(currentExercise.restSeconds);
        } else {
            const nextIndex = currentExerciseIndex + 1;
            const newCompletedCount = completedExercises + 1;
            setCompletedExercises(newCompletedCount);

            if (nextIndex < exercises.length) {
                setCurrentExerciseIndex(nextIndex);
                setCurrentSet(1);
                setIsResting(false);
            } else {
                await handleFinishWorkout(newCompletedCount);
            }
        }
    }, [exercises, currentExerciseIndex, currentSet, completedExercises, sessionId, elapsed]);

    const handleSkipRest = () => {
        setRestTimeLeft(0);
        setIsResting(false);
    };

    const handleFinishWorkout = async (finalCompleted?: number) => {
        try {
            // Real API: finish the session
            // await WorkoutService.finishWorkoutSession(sessionId, {
            //     status: 'completed',
            //     finishedAt: new Date().toISOString(),
            //     totalDurationSec: elapsed,
            //     caloriesBurned: Math.round(elapsed / 60 * 5),
            // });
            setIsFinished(true);
        } catch (error) {
            console.error('Failed to finish workout session:', error);
        }
    };

    const handleClose = async () => {
        try {
            // Real API: cancel session if still active
            // await WorkoutService.cancelWorkoutSession(sessionId);
        } finally {
            navigation.navigate('MainTabs');
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color={colors.primaryButton} />
            </View>
        );
    }

    if (isFinished) {
        return (
            <View style={[styles.container, styles.centered]}>
                <WorkoutSessionHeader elapsed={elapsed} onClose={handleClose} />
                <View style={styles.completionContainer}>
                    <Text style={styles.completionEmoji}>🎉</Text>
                    <Text style={styles.completionTitle}>Workout Complete!</Text>
                    <Text style={styles.completionSubtitle}>
                        {exercises.length} exercises · {Math.round(elapsed / 60)} min
                    </Text>
                    <TouchableOpacity
                        style={styles.doneButton}
                        onPress={() => navigation.navigate('MainTabs')}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.doneButtonText}>Done</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const currentExercise = exercises[currentExerciseIndex];
    if (!currentExercise) return null;

    return (
        <View style={styles.container}>
            <WorkoutSessionHeader elapsed={elapsed} onClose={handleClose} />

            <View style={styles.main}>
                <ExerciseSetDisplay exercise={currentExercise} currentSet={currentSet} />

                {isResting ? (
                    <RestTimerCard
                        timeLeft={restTimeLeft}
                        restSeconds={currentExercise.restSeconds}
                        onSkip={handleSkipRest}
                    />
                ) : (
                    <View style={styles.actionArea}>
                        <TouchableOpacity
                            style={styles.completeSetButton}
                            onPress={handleCompleteSet}
                            activeOpacity={0.85}
                        >
                            <Text style={styles.completeSetText}>Complete Set</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.skipExerciseButton}
                            onPress={async () => {
                                const nextIndex = currentExerciseIndex + 1;
                                const newCompleted = completedExercises + 1;
                                setCompletedExercises(newCompleted);

                                if (nextIndex < exercises.length) {
                                    setCurrentExerciseIndex(nextIndex);
                                    setCurrentSet(1);
                                } else {
                                    await handleFinishWorkout(newCompleted);
                                }
                            }}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.skipExerciseText}>Skip Exercise</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <WorkoutProgressBar
                completedExercises={completedExercises}
                totalExercises={exercises.length}
            />
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
    main: {
        flex: 1,
        justifyContent: 'space-between',
        paddingBottom: 16,
    },
    actionArea: {
        paddingHorizontal: 20,
        gap: 12,
    },
    completeSetButton: {
        backgroundColor: colors.primaryButton,
        borderRadius: 18,
        paddingVertical: 16,
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
    completeSetText: {
        color: '#FFFFFF',
        ...typography.button,
        fontSize: 17,
    },
    skipExerciseButton: {
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    skipExerciseText: {
        ...typography.link,
        color: colors.textSecondary,
    },
    completionContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        gap: 12,
    },
    completionEmoji: {
        fontSize: 64,
        marginBottom: 8,
    },
    completionTitle: {
        ...typography.title,
        fontSize: 28,
        lineHeight: 36,
        color: colors.textPrimary,
        textAlign: 'center',
    },
    completionSubtitle: {
        ...typography.input,
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: 16,
    },
    doneButton: {
        backgroundColor: colors.primaryButton,
        borderRadius: 18,
        paddingVertical: 14,
        paddingHorizontal: 48,
        alignItems: 'center',
        shadowColor: colors.shadow,
        shadowOpacity: 0.12,
        shadowRadius: 16,
        shadowOffset: {
            width: 0,
            height: 10,
        },
        elevation: 4,
    },
    doneButtonText: {
        color: '#FFFFFF',
        ...typography.button,
    },
});

export default ActiveWorkoutSessionScreen;
