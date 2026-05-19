import { StyleSheet } from 'react-native';
import { colors, typography } from '@/theme';

export const workoutPlanPreviewCardStyles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: '#D8E0E8',
        shadowColor: '#0F172A',
        shadowOpacity: 0.06,
        shadowRadius: 14,
        shadowOffset: {
            width: 0,
            height: 6,
        },
        elevation: 3,
    },
    badge: {
        alignSelf: 'flex-start',
        borderRadius: 999,
        backgroundColor: '#EEF6FF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginBottom: 16,
    },
    badgeText: {
        ...typography.helperText,
        color: '#2563EB',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
    },
    rowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#ECF0F4',
    },
    dayLabel: {
        ...typography.label,
        color: colors.textPrimary,
        width: 64,
        marginRight: 16,
    },
    workoutLabel: {
        ...typography.input,
        color: colors.textSecondary,
        flex: 1,
    },
});
