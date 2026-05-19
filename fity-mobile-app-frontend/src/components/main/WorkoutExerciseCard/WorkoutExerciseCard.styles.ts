import { StyleSheet } from 'react-native';
import { colors, typography } from '@/theme';

export const workoutExerciseCardStyles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: 22,
        padding: 18,
        borderWidth: 1,
        borderColor: colors.borderSoft,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    nameText: {
        ...typography.label,
        fontSize: 16,
        color: colors.textPrimary,
        flex: 1,
        marginRight: 8,
    },
    muscleTag: {
        backgroundColor: colors.surfaceTint,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    muscleText: {
        ...typography.helperText,
        fontSize: 12,
        color: colors.primaryButton,
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 14,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    detailText: {
        ...typography.helperText,
        fontSize: 13,
        color: colors.textSecondary,
    },
    chipsRow: {
        flexDirection: 'row',
        gap: 8,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 20,
        backgroundColor: colors.surfaceMuted,
        borderWidth: 1,
        borderColor: colors.borderSoft,
    },
    chipCompleted: {
        backgroundColor: colors.success,
        borderColor: colors.success,
    },
    chipDiscomfort: {
        backgroundColor: '#EF4444',
        borderColor: '#EF4444',
    },
    chipText: {
        ...typography.helperText,
        fontSize: 13,
        color: colors.textSecondary,
    },
    chipTextActive: {
        color: '#FFFFFF',
    },
});
