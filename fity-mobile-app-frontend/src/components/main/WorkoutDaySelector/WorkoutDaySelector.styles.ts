import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';

export const workoutDaySelectorStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 6,
    },
    dayButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 14,
        backgroundColor: colors.surface,
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    dayButtonActive: {
        backgroundColor: colors.primaryButton,
        borderColor: colors.primaryButton,
    },
    dayLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.textSecondary,
        marginBottom: 4,
    },
    dayLabelActive: {
        color: '#FFFFFF',
    },
    dayDate: {
        fontSize: 16,
        fontWeight: '800',
        color: colors.textPrimary,
    },
    dayDateActive: {
        color: '#FFFFFF',
    },
});
