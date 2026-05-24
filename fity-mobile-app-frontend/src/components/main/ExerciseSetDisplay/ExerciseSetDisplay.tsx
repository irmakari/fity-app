import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { exerciseSetDisplayStyles as styles } from './ExerciseSetDisplay.styles';
import { TExerciseSetDisplayProps } from './ExerciseSetDisplay.type';

export default function ExerciseSetDisplay({ exercise, currentSet }: TExerciseSetDisplayProps) {
    return (
        <View style={styles.container}>
            <View style={styles.muscleTag}>
                <Text style={styles.muscleText}>{exercise.muscleGroup}</Text>
            </View>

            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Text style={styles.setLabel}>
                Set {currentSet} of {exercise.sets}
            </Text>

            <View style={styles.repsCircle}>
                <Text style={styles.repsNumber}>{exercise.reps}</Text>
                <Text style={styles.repsUnit}>reps</Text>
            </View>

            <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                    <Ionicons name="repeat-outline" size={16} color="#9E9E9E" />
                    <Text style={styles.detailText}>
                        {exercise.sets} sets × {exercise.reps} reps
                    </Text>
                </View>
                <View style={styles.detailItem}>
                    <Ionicons name="timer-outline" size={16} color="#9E9E9E" />
                    <Text style={styles.detailText}>{exercise.restSeconds}s rest</Text>
                </View>
            </View>
        </View>
    );
}
