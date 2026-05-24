import React from 'react';
import { View, Text } from 'react-native';

import { macroProgressBarStyles } from './MacroProgressBar.styles';
import { TMacroProgressBarProps } from './MacroProgressBar.type';

export default function MacroProgressBar({ label, current, goal, color, unit = 'g' }: TMacroProgressBarProps) {
    const progress = goal > 0 ? Math.min(current / goal, 1) : 0;

    return (
        <View style={macroProgressBarStyles.container}>
            <View style={macroProgressBarStyles.labelRow}>
                <Text style={macroProgressBarStyles.label}>{label}</Text>
                <Text style={macroProgressBarStyles.value}>{current}/{goal}{unit}</Text>
            </View>
            <View style={macroProgressBarStyles.track}>
                <View
                    style={[
                        macroProgressBarStyles.fill,
                        { width: `${progress * 100}%`, backgroundColor: color },
                    ]}
                />
            </View>
        </View>
    );
}
