import { StyleSheet } from 'react-native';
import { colors, typography } from '@/theme';

export const stepProgressStyles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    label: {
        ...typography.helperText,
        color: colors.textSecondary,
        marginBottom: 10,
    },
    track: {
        height: 8,
        borderRadius: 999,
        backgroundColor: '#DCE4EC',
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
        borderRadius: 999,
        backgroundColor: colors.primaryButton,
    },
});
