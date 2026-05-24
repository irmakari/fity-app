import { StyleSheet } from 'react-native';
import { colors, typography } from '@/theme';

export const authButtonStyles = StyleSheet.create({
    button: {
        height: 56,
        borderRadius: 18,
        backgroundColor: colors.primaryButton,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
        shadowColor: colors.shadow,
        shadowOpacity: 0.12,
        shadowRadius: 16,
        shadowOffset: {
            width: 0,
            height: 10,
        },
        elevation: 4,
    },
    fullWidth: {
        width: '100%',
    },
    disabledButton: {
        backgroundColor: colors.disabledBackground,
        shadowOpacity: 0,
        elevation: 0,
    },
    text: {
        ...typography.button,
        color: colors.surface,
    },
    disabledText: {
        color: colors.disabledText,
    },
});
