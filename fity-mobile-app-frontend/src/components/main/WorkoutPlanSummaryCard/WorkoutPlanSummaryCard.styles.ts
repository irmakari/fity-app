import { StyleSheet } from 'react-native';
import { colors, typography } from '@/theme';

export const workoutPlanSummaryCardStyles = StyleSheet.create({
    card: {
        backgroundColor: '#0a1128',
        borderRadius: 24,
        paddingVertical: 22,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        shadowColor: colors.shadow,
        shadowOpacity: 0.12,
        shadowRadius: 18,
        shadowOffset: {
            width: 0,
            height: 10,
        },
        elevation: 4,
    },
    planName: {
        ...typography.title,
        fontSize: 20,
        lineHeight: 28,
        color: '#FFFFFF',
        marginBottom: 12,
    },
    metaRow: {
        flexDirection: 'row',
        gap: 20,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metaText: {
        ...typography.helperText,
        fontSize: 13,
        color: 'rgba(255,255,255,0.75)',
    },
});
