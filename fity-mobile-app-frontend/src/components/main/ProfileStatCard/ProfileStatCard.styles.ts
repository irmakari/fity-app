import { StyleSheet } from 'react-native';
import { colors, typography } from '@/theme';

export const profileStatCardStyles = StyleSheet.create({
    card: {
        width: '48%',
        backgroundColor: colors.surface,
        borderRadius: 22,
        paddingVertical: 18,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: colors.borderSoft,
        shadowColor: colors.shadow,
        shadowOpacity: 0.05,
        shadowRadius: 12,
        shadowOffset: {
            width: 0,
            height: 6,
        },
        elevation: 2,
    },
    topAccent: {
        width: 36,
        height: 6,
        borderRadius: 999,
        marginBottom: 16,
    },
    value: {
        ...typography.title,
        fontSize: 22,
        lineHeight: 30,
        color: colors.textPrimary,
        marginBottom: 4,
    },
    label: {
        ...typography.helperText,
        fontSize: 13,
        color: colors.textSecondary,
    },
});
