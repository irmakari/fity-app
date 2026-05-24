import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { workoutDaySelectorStyles as styles } from './WorkoutDaySelector.styles';
import { TWorkoutDaySelectorProps } from './WorkoutDaySelector.type';

export default function WorkoutDaySelector({
    days,
    activeDayIndex,
    onSelect,
}: TWorkoutDaySelectorProps) {
    return (
        <View style={styles.container}>
            {days.map((day, index) => {
                const isActive = index === activeDayIndex;
                return (
                    <TouchableOpacity
                        key={`${day.label}-${day.date}`}
                        style={[styles.dayButton, isActive && styles.dayButtonActive]}
                        onPress={() => onSelect(index)}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.dayLabel, isActive && styles.dayLabelActive]}>
                            {day.label}
                        </Text>
                        <Text style={[styles.dayDate, isActive && styles.dayDateActive]}>
                            {day.date}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}
