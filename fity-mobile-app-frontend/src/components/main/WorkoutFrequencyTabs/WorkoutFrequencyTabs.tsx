import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { workoutFrequencyTabsStyles as styles } from './WorkoutFrequencyTabs.styles';
import { TWorkoutFrequencyTabsProps } from './WorkoutFrequencyTabs.type';

export default function WorkoutFrequencyTabs({
    options,
    activeIndex,
    onSelect,
}: TWorkoutFrequencyTabsProps) {
    return (
        <View style={styles.container}>
            {options.map((option, index) => (
                <TouchableOpacity
                    key={option}
                    style={[styles.tab, index === activeIndex && styles.tabActive]}
                    onPress={() => onSelect(index)}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.tabText, index === activeIndex && styles.tabTextActive]}>
                        {option}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}
