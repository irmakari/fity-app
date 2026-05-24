import { StyleSheet } from 'react-native';
import { colors, typography } from '@/theme';

export const nutritionMealCardStyles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: 24,
        paddingVertical: 18,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: colors.borderSoft,
        shadowColor: colors.shadow,
        shadowOpacity: 0.06,
        shadowRadius: 14,
        shadowOffset: {
            width: 0,
            height: 6,
        },
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    mealType: {
        ...typography.label,
        fontSize: 16,
        color: colors.textPrimary,
        marginBottom: 4,
    },
    caloriesText: {
        ...typography.helperText,
        fontSize: 13,
        color: colors.textSecondary,
    },
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.borderSoft,
    },
    foodsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    foodChip: {
        backgroundColor: colors.surfaceTint,
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 7,
    },
    foodChipText: {
        ...typography.helperText,
        fontSize: 13,
        color: colors.primaryButton,
    },
    emptyText: {
        ...typography.helperText,
        fontSize: 13,
        color: colors.textMuted,
        fontStyle: 'italic',
    },
});
