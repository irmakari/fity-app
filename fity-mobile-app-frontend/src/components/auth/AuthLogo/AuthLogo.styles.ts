import { StyleSheet } from 'react-native';
import { colors, typography } from '@/theme';

export const authLogoStyles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
    },
    logo: {
        width: 256,
        height: 256,
        resizeMode: 'contain',
    },
    text: {
        ...typography.title,
        fontSize: 24,
        lineHeight: 30,
        color: colors.textPrimary,
    },
});