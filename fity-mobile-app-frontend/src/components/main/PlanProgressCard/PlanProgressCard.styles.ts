import { StyleSheet } from 'react-native';
import { colors, typography } from '@/theme';

export const planProgressCardStyles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: 24,
        paddingVertical: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: colors.borderSoft,
        shadowColor: colors.shadow,
        shadowOpacity: 0.06,
        shadowRadius: 14,
        shadowOffset: {
            width: 0,
            height: 6,
        },
        elevation: 3,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 12,
    },
    iconWrapper: {
        width: 52,
        height: 52,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    content: {
        flex: 1,
    },
    title: {
        ...typography.label,
        fontSize: 16,
        color: colors.textPrimary,
        marginBottom: 4,
    },
    value: {
        ...typography.input,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    subtitle: {
        ...typography.helperText,
        fontSize: 13,
        color: colors.textSecondary,
        marginBottom: 10,
    },
    progressTrack: {
        width: 150,
        height: 10,
        borderRadius: 999,
        backgroundColor: '#E7EDF3',
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 999,
    },
    footerRow: {
        marginTop: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
    },
    insightText: {
        ...typography.helperText,
        fontSize: 12,
        color: colors.textSecondary,
        flex: 1,
    },
    actionBadge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
    },
    actionText: {
        ...typography.helperText,
        fontSize: 11,
    },
    arrowButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surfaceMuted,
    },
});
