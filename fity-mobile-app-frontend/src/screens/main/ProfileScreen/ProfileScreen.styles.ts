import { StyleSheet } from 'react-native';
import { colors, typography } from '@/theme';

export const profileScreenStyles = StyleSheet.create({
    scrollContent: {
        paddingBottom: 28,
        gap: 16,
    },
    sectionCard: {
        backgroundColor: colors.surface,
        borderRadius: 24,
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
    sectionTitle: {
        ...typography.label,
        fontSize: 16,
        color: colors.textPrimary,
        marginBottom: 10,
    },
    chipWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 999,
        backgroundColor: colors.surfaceTint,
    },
    chipText: {
        ...typography.helperText,
        fontSize: 13,
        color: colors.primaryButton,
    },
    emptyText: {
        ...typography.input,
        color: colors.textSecondary,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 14,
    },
    logoutButton: {
        height: 56,
        borderRadius: 18,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.shadow,
        shadowOpacity: 0.12,
        shadowRadius: 16,
        shadowOffset: {
            width: 0,
            height: 10,
        },
        elevation: 4,
    },
    logoutButtonText: {
        ...typography.button,
        color: colors.surface,
    },
});
