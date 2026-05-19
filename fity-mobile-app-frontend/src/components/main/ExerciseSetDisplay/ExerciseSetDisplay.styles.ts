import { StyleSheet } from 'react-native';
import { colors, typography } from '@/theme';

const ACCENT = '#A855F7';

export const exerciseSetDisplayStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: 32,
        paddingHorizontal: 24,
    },
    muscleTag: {
        backgroundColor: `${ACCENT}12`,
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 7,
        marginBottom: 16,
    },
    muscleText: {
        ...typography.helperText,
        fontSize: 13,
        color: ACCENT,
    },
    exerciseName: {
        ...typography.title,
        fontSize: 28,
        lineHeight: 36,
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: 8,
    },
    setLabel: {
        ...typography.input,
        fontSize: 16,
        color: colors.textSecondary,
        marginBottom: 24,
    },
    repsCircle: {
        width: 148,
        height: 148,
        borderRadius: 74,
        borderWidth: 4,
        borderColor: ACCENT,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        backgroundColor: `${ACCENT}08`,
    },
    repsNumber: {
        ...typography.title,
        fontSize: 48,
        lineHeight: 56,
        color: colors.textPrimary,
    },
    repsUnit: {
        ...typography.input,
        fontSize: 16,
        color: colors.textSecondary,
    },
    detailsRow: {
        flexDirection: 'row',
        gap: 24,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    detailText: {
        ...typography.input,
        fontSize: 14,
        color: colors.textSecondary,
    },
});
