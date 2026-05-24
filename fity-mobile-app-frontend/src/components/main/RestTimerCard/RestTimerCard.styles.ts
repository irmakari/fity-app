import { StyleSheet } from 'react-native';
import { colors, typography } from '@/theme';

export const restTimerCardStyles = StyleSheet.create({
    container: {
        backgroundColor: colors.surface,
        borderRadius: 26,
        paddingVertical: 28,
        paddingHorizontal: 24,
        alignItems: 'center',
        marginHorizontal: 16,
        borderWidth: 1,
        borderColor: colors.borderSoft,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 14,
        elevation: 3,
    },
    label: {
        ...typography.helperText,
        fontSize: 13,
        color: colors.textSecondary,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    countdown: {
        ...typography.title,
        fontSize: 56,
        lineHeight: 64,
        color: colors.textPrimary,
        fontVariant: ['tabular-nums'],
        marginBottom: 4,
    },
    subLabel: {
        ...typography.input,
        fontSize: 14,
        color: colors.textMuted,
        marginBottom: 20,
    },
    progressTrack: {
        width: '100%',
        height: 6,
        borderRadius: 3,
        backgroundColor: '#E7EDF3',
        overflow: 'hidden',
        marginBottom: 20,
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
        backgroundColor: colors.primaryButton,
    },
    skipButton: {
        paddingHorizontal: 24,
        paddingVertical: 11,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: colors.borderSoft,
        backgroundColor: colors.surfaceMuted,
    },
    skipText: {
        ...typography.link,
        color: colors.textSecondary,
    },
});
