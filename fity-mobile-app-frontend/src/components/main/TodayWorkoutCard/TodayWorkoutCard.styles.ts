import { StyleSheet } from 'react-native';
import { colors, typography } from '@/theme';

const ACCENT = '#A855F7';

export const todayWorkoutCardStyles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: 24,
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: colors.borderSoft,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 14,
        elevation: 3,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    iconWrapper: {
        width: 52,
        height: 52,
        borderRadius: 18,
        backgroundColor: `${ACCENT}12`,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    info: {
        flex: 1,
    },
    planName: {
        ...typography.label,
        fontSize: 17,
        color: colors.textPrimary,
        marginBottom: 6,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        gap: 6,
    },
    metaText: {
        ...typography.helperText,
        fontSize: 13,
        color: colors.textSecondary,
    },
    statusIcon: {
        marginLeft: 4,
    },
    divider: {
        height: 1,
        backgroundColor: '#ECF0F4',
        marginVertical: 16,
    },
    button: {
        backgroundColor: colors.primaryButton,
        borderRadius: 16,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
        shadowColor: colors.shadow,
        shadowOpacity: 0.12,
        shadowRadius: 14,
        shadowOffset: {
            width: 0,
            height: 8,
        },
        elevation: 4,
    },
    buttonText: {
        color: '#FFFFFF',
        ...typography.button,
    },
});
