import { StyleSheet } from 'react-native';
import { colors, typography } from '@/theme';

export const workoutFrequencyTabsStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: colors.surfaceMuted,
        borderRadius: 18,
        padding: 4,
        borderWidth: 1,
        borderColor: colors.borderSoft,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabActive: {
        backgroundColor: colors.surface,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    tabText: {
        ...typography.link,
        color: colors.textMuted,
    },
    tabTextActive: {
        color: colors.primaryButton,
    },
});
