import React from 'react';
import { View, Text } from 'react-native';

import { workoutProgressBarStyles as styles } from './WorkoutProgressBar.styles';
import { TWorkoutProgressBarProps } from './WorkoutProgressBar.type';

export default function WorkoutProgressBar({
    completedExercises,
    totalExercises,
}: TWorkoutProgressBarProps) {
    const progress = totalExercises > 0 ? completedExercises / totalExercises : 0;
    const percent = Math.round(progress * 100);

    return (
        <View style={styles.container}>
            <View style={styles.labelRow}>
                <Text style={styles.labelText}>
                    {completedExercises} of {totalExercises} exercises completed
                </Text>
                <Text style={styles.percentText}>{percent}%</Text>
            </View>
            <View style={styles.track}>
                <View style={[styles.fill, { width: `${percent}%` }]} />
            </View>
        </View>
    );
}
