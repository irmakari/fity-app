import { StyleSheet } from 'react-native';
import { colors, typography } from '@/theme';

export const profileSummaryCardStyles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: 26,
        padding: 20,
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
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 68,
        height: 68,
        borderRadius: 22,
        backgroundColor: colors.surfaceTint,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    initials: {
        ...typography.title,
        fontSize: 22,
        lineHeight: 28,
        color: colors.primaryButton,
    },
    content: {
        flex: 1,
    },
    name: {
        ...typography.title,
        fontSize: 22,
        lineHeight: 30,
        color: colors.textPrimary,
        marginBottom: 4,
    },
    email: {
        ...typography.input,
        color: colors.textSecondary,
        marginBottom: 6,
    },
    subtitleBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 999,
        backgroundColor: colors.surfaceMuted,
    },
    subtitle: {
        ...typography.helperText,
        fontSize: 13,
        color: colors.textPrimary,
    },
});
