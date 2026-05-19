import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { workoutPlanSummaryCardStyles as styles } from './WorkoutPlanSummaryCard.styles';
import { TWorkoutPlanSummaryCardProps } from './WorkoutPlanSummaryCard.type';

export default function WorkoutPlanSummaryCard({
    name,
    dayLabel,
    estimatedDurationMin,
    exerciseCount,
}: TWorkoutPlanSummaryCardProps) {
    return (
        <View style={styles.card}>
            <Text style={styles.planName}>
                {name} – {dayLabel}
            </Text>
            <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={16} color="rgba(255,255,255,0.7)" />
                    <Text style={styles.metaText}>{estimatedDurationMin} min</Text>
                </View>
                <View style={styles.metaItem}>
                    <Ionicons name="list-outline" size={16} color="rgba(255,255,255,0.7)" />
                    <Text style={styles.metaText}>{exerciseCount} exercises</Text>
                </View>
            </View>
        </View>
    );
}
