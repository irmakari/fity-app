import React from 'react';
import { Text, TextInput, View } from 'react-native';
import { colors } from '@/theme';
import { statsInputStyles } from '@/components/onboarding/StatsInput/StatsInput.styles';
import { TStatsInputProps } from '@/components/onboarding/StatsInput/StatsInput.type';

const StatsInput = ({
    label,
    value,
    onChange,
    placeholder,
    unit,
}: TStatsInputProps) => {
    return (
        <View style={statsInputStyles.container}>
            <Text style={statsInputStyles.label}>{label}</Text>

            <View style={statsInputStyles.inputWrapper}>
                <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder={placeholder}
                    keyboardType="number-pad"
                    style={statsInputStyles.input}
                    placeholderTextColor={colors.inputPlaceholder}
                />

                {!!unit && <Text style={statsInputStyles.unit}>{unit}</Text>}
            </View>
        </View>
    );
};

export default StatsInput;
