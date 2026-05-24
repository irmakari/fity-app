import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { workoutSessionHeaderStyles as styles } from './WorkoutSessionHeader.styles';
import { TWorkoutSessionHeaderProps } from './WorkoutSessionHeader.type';

function formatElapsed(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function WorkoutSessionHeader({ elapsed, onClose }: TWorkoutSessionHeaderProps) {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.75}>
                <Ionicons name="close" size={22} color="#374151" />
            </TouchableOpacity>

            <View style={styles.timerContainer}>
                <Ionicons name="time-outline" size={16} color="#6B7280" />
                <Text style={styles.timerText}>{formatElapsed(elapsed)}</Text>
            </View>
        </View>
    );
}
