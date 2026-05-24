import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { workoutCategoryCardStyles as styles } from './WorkoutCategoryCard.styles';
import { TWorkoutCategoryCardProps } from './WorkoutCategoryCard.type';

export default function WorkoutCategoryCard({
    name,
    exerciseCount,
    iconName,
    accentColor,
    onPress,
}: TWorkoutCategoryCardProps) {
    return (
        <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
            <View style={[styles.iconWrapper, { backgroundColor: `${accentColor}18` }]}>
                <Ionicons name={iconName} size={24} color={accentColor} />
            </View>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.count}>{exerciseCount} exercises</Text>
        </TouchableOpacity>
    );
}
