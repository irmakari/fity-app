import { StyleSheet } from 'react-native';
import { colors, typography } from '@/theme';

export const askAiCardStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 24,
        paddingVertical: 20,
        paddingHorizontal: 20,
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
    iconWrapper: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: colors.surfaceTint,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        ...typography.title,
        fontSize: 22,
        lineHeight: 30,
        color: colors.textPrimary,
        marginBottom: 6,
    },
    description: {
        ...typography.input,
        lineHeight: 22,
        color: colors.textSecondary,
        paddingRight: 8,
    },
});
