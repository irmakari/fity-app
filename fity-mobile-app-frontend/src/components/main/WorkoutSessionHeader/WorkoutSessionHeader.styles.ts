import { StyleSheet } from 'react-native';
import { colors, typography } from '@/theme';

export const workoutSessionHeaderStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 64,
        paddingBottom: 18,
        backgroundColor: colors.background,
        borderBottomWidth: 0,
    },
    closeButton: {
        width: 44,
        height: 44,
        borderRadius: 18,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderSoft,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.shadow,
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        elevation: 2,
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: colors.surface,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: colors.borderSoft,
        shadowColor: colors.shadow,
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        elevation: 2,
    },
    timerText: {
        ...typography.label,
        fontSize: 16,
        color: colors.textPrimary,
        fontVariant: ['tabular-nums'],
    },
});
