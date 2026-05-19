import { StyleSheet } from 'react-native';
import { colors, typography } from '@/theme';

export const authLinkTextStyles = StyleSheet.create({
    button: {
        marginTop: 16,
    },
    text: {
        ...typography.link,
        color: colors.textSecondary,
    },
    disabledText: {
        color: colors.disabledText,
    },
});