import { StyleSheet } from 'react-native';
import { colors, layout } from '@/theme';

export const onboardingScreenLayoutStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    keyboardContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: layout.screenPaddingHorizontal,
        paddingTop: 12,
    },
    topRow: {
        minHeight: 40,
        justifyContent: 'center',
        marginBottom: 8,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        paddingBottom: 24,
    },
    bottomContainer: {
        paddingTop: 12,
        paddingBottom: 12,
        backgroundColor: colors.background,
    },
});
