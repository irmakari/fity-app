import { StyleSheet } from 'react-native';
import { colors, typography } from '@/theme';

export const authHeaderStyles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 24,
    },
    title: {
        ...typography.title,
        color: colors.textPrimary,
        marginBottom: 8,
    },
    description: {
        ...typography.subtitle,
        color: colors.textSecondary,
    },
});