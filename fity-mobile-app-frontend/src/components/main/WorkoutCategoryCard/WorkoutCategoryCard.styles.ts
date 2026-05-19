import { StyleSheet } from 'react-native';
import { colors, typography } from '@/theme';

export const workoutCategoryCardStyles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: 22,
        paddingVertical: 20,
        paddingHorizontal: 16,
        alignItems: 'center',
        flex: 1,
        borderWidth: 1,
        borderColor: colors.borderSoft,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
    },
    iconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    name: {
        ...typography.label,
        fontSize: 15,
        color: colors.textPrimary,
        marginBottom: 4,
    },
    count: {
        ...typography.helperText,
        fontSize: 13,
        color: colors.textMuted,
    },
});
