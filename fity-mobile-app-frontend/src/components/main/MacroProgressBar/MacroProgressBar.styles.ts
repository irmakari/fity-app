import { StyleSheet } from 'react-native';
import { colors, typography } from '@/theme';

export const macroProgressBarStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        ...typography.helperText,
        fontSize: 13,
        color: colors.textSecondary,
    },
    value: {
        ...typography.helperText,
        fontSize: 12,
        color: colors.textMuted,
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
    },
});
