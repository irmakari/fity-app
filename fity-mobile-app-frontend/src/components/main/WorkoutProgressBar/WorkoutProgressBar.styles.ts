import { StyleSheet } from 'react-native';
import { colors, typography } from '@/theme';

export const workoutProgressBarStyles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.borderSoft,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    labelText: {
        ...typography.helperText,
        fontSize: 13,
        color: colors.textSecondary,
    },
    percentText: {
        ...typography.helperText,
        fontSize: 13,
        color: colors.primaryButton,
    },
    track: {
        height: 10,
        borderRadius: 999,
        backgroundColor: '#E7EDF3',
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
        borderRadius: 999,
        backgroundColor: colors.primaryButton,
    },
});
