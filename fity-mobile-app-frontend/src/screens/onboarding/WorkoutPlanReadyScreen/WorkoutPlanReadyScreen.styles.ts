import { StyleSheet } from 'react-native';
import { colors, typography } from '@/theme';

export const workoutPlanReadyScreenStyles = StyleSheet.create({
    content: {
        gap: 20,
    },
    summaryCard: {
        backgroundColor: colors.surface,
        borderRadius: 22,
        padding: 18,
        borderWidth: 1,
        borderColor: '#D8E0E8',
    },
    summaryTitle: {
        ...typography.label,
        color: colors.textPrimary,
        marginBottom: 8,
    },
    summaryText: {
        ...typography.helperText,
        fontSize: 13,
        lineHeight: 18,
        color: colors.textSecondary,
    },
});
