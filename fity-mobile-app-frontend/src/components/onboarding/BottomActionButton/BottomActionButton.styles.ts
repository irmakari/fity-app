import { StyleSheet } from 'react-native';
import { colors, typography } from '@/theme';

export const bottomActionButtonStyles = StyleSheet.create({
    button: {
        height: 56,
        borderRadius: 18,
        backgroundColor: colors.primaryButton,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#0F172A',
        shadowOpacity: 0.12,
        shadowRadius: 16,
        shadowOffset: {
            width: 0,
            height: 10,
        },
        elevation: 4,
    },
    disabledButton: {
        backgroundColor: colors.disabledBackground,
        shadowOpacity: 0,
        elevation: 0,
    },
    label: {
        ...typography.button,
        color: colors.surface,
    },
    disabledLabel: {
        color: colors.disabledText,
    },
});
