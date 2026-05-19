import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { todayWorkoutCardStyles as styles } from './TodayWorkoutCard.styles';
import { TTodayWorkoutCardProps } from './TodayWorkoutCard.type';

export default function TodayWorkoutCard({ plan, onPress, onStartWorkout }: TTodayWorkoutCardProps) {
    return (
        <TouchableOpacity style={styles.card} activeOpacity={0.88} onPress={onPress}>
            <View style={styles.topRow}>
                <View style={styles.iconWrapper}>
                    <Ionicons name="barbell-outline" size={26} color="#A855F7" />
                </View>

                <View style={styles.info}>
                    <Text style={styles.planName}>
                        {plan.name} – {plan.dayLabel}
                    </Text>
                    <View style={styles.metaRow}>
                        <Ionicons name="time-outline" size={15} color="#9E9E9E" />
                        <Text style={styles.metaText}>{plan.estimatedDurationMin} min</Text>
                    </View>
                    <View style={styles.metaRow}>
                        <Ionicons name="list-outline" size={15} color="#9E9E9E" />
                        <Text style={styles.metaText}>{plan.exerciseCount} exercises</Text>
                    </View>
                </View>

                <Ionicons
                    name="checkmark-circle-outline"
                    size={28}
                    color="#A855F7"
                    style={styles.statusIcon}
                />
            </View>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.button} activeOpacity={0.85} onPress={onStartWorkout}>
                <Ionicons name="play" size={16} color="#FFFFFF" />
                <Text style={styles.buttonText}>Start Workout</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );
}
