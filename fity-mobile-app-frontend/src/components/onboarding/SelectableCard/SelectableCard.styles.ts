import { StyleSheet } from 'react-native';
import { colors, typography } from '@/theme';

export const selectableCardStyles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderColor: '#D8E0E8',
        borderRadius: 22,
        backgroundColor: colors.surface,
        padding: 18,
        minHeight: 126,
        justifyContent: 'space-between',
        shadowColor: '#0F172A',
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: {
            width: 0,
            height: 6,
        },
        elevation: 2,
    },
    compactCard: {
        minHeight: 88,
        justifyContent: 'center',
    },
    selectedCard: {
        borderColor: colors.primaryButton,
        backgroundColor: '#EEF6FF',
        shadowOpacity: 0.1,
        elevation: 4,
    },
    iconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: '#F5F7FA',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    selectedIconWrapper: {
        backgroundColor: '#DDEEFF',
    },
    content: {
        gap: 6,
    },
    title: {
        ...typography.label,
        fontSize: 17,
        color: colors.textPrimary,
    },
    description: {
        ...typography.helperText,
        fontSize: 13,
        lineHeight: 18,
        color: colors.textSecondary,
    },
});
