import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { restTimerCardStyles as styles } from './RestTimerCard.styles';
import { TRestTimerCardProps } from './RestTimerCard.type';

export default function RestTimerCard({ timeLeft, restSeconds, onSkip }: TRestTimerCardProps) {
    const progress = restSeconds > 0 ? Math.max(0, timeLeft / restSeconds) : 0;

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Rest</Text>
            <Text style={styles.countdown}>{timeLeft}</Text>
            <Text style={styles.subLabel}>seconds remaining</Text>

            <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
            </View>

            <TouchableOpacity style={styles.skipButton} onPress={onSkip} activeOpacity={0.75}>
                <Text style={styles.skipText}>Skip Rest</Text>
            </TouchableOpacity>
        </View>
    );
}
