import { StyleSheet } from 'react-native';
import { colors, typography } from '@/theme';

export const homeGreetingHeaderStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.surface,
        borderRadius: 28,
        paddingVertical: 18,
        paddingHorizontal: 18,
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
    avatarWrapper: {
        width: 62,
        height: 62,
        borderRadius: 22,
        backgroundColor: colors.surfaceTint,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    avatarText: {
        ...typography.title,
        fontSize: 22,
        lineHeight: 28,
        color: colors.primaryButton,
    },
    textWrapper: {
        flex: 1,
        justifyContent: 'center',
    },
    greetingBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 999,
        backgroundColor: colors.surfaceMuted,
        marginBottom: 8,
    },
    greetingText: {
        ...typography.helperText,
        fontSize: 12,
        color: colors.textSecondary,
    },
    nameText: {
        ...typography.title,
        fontSize: 24,
        lineHeight: 30,
        color: colors.textPrimary,
    },
    logoutButton: {
        width: 48,
        height: 48,
        borderRadius: 18,
        backgroundColor: colors.surfaceMuted,
        borderWidth: 1,
        borderColor: colors.borderSoft,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
