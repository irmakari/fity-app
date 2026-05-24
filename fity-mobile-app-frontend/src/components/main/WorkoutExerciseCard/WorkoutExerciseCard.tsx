import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { workoutExerciseCardStyles as styles } from './WorkoutExerciseCard.styles';
import { TWorkoutExerciseCardProps } from './WorkoutExerciseCard.type';

export default function WorkoutExerciseCard({
    exercise,
    onToggleCompleted,
    onToggleDiscomfort,
}: TWorkoutExerciseCardProps) {
    return (
        <View style={styles.card}>
            <View style={styles.topRow}>
                <Text style={styles.nameText}>{exercise.name}</Text>
                <View style={styles.muscleTag}>
                    <Text style={styles.muscleText}>{exercise.muscleGroup}</Text>
                </View>
            </View>

            <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                    <Ionicons name="repeat-outline" size={15} color="#9E9E9E" />
                    <Text style={styles.detailText}>
                        {exercise.sets} × {exercise.reps} reps
                    </Text>
                </View>
                <View style={styles.detailItem}>
                    <Ionicons name="timer-outline" size={15} color="#9E9E9E" />
                    <Text style={styles.detailText}>{exercise.restSeconds}s rest</Text>
                </View>
            </View>

            <View style={styles.chipsRow}>
                <TouchableOpacity
                    style={[styles.chip, exercise.isCompleted && styles.chipCompleted]}
                    onPress={onToggleCompleted}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name={exercise.isCompleted ? 'checkmark-circle' : 'checkmark-circle-outline'}
                        size={15}
                        color={exercise.isCompleted ? '#FFFFFF' : '#9E9E9E'}
                    />
                    <Text style={[styles.chipText, exercise.isCompleted && styles.chipTextActive]}>
                        Completed
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.chip, exercise.hasDiscomfort && styles.chipDiscomfort]}
                    onPress={onToggleDiscomfort}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name="warning-outline"
                        size={15}
                        color={exercise.hasDiscomfort ? '#FFFFFF' : '#9E9E9E'}
                    />
                    <Text
                        style={[styles.chipText, exercise.hasDiscomfort && styles.chipTextActive]}
                    >
                        Pain / Discomfort
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
