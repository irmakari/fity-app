import { StyleSheet } from 'react-native';
import { colors, typography } from '@/theme';

export const authInputStyles = StyleSheet.create({
    container: {
        width: '100%',
        paddingVertical: 14,
    },
    label: {
        ...typography.label,
        fontSize: 15,
        color: colors.textPrimary,
        marginBottom: 8,
    },
    inputWrapper: {
        width: '100%',
        height: 58,
        backgroundColor: colors.inputBackground,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: colors.borderSoft,
        shadowColor: colors.shadow,
        shadowOpacity: 0.04,
        shadowRadius: 10,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        elevation: 1,
    },
    input: {
        flex: 1,
        height: '100%',
        ...typography.input,
        color: colors.textPrimary,
    },
    inputError: {
        borderColor: colors.borderError,
    },
    inputDisabled: {
        backgroundColor: colors.disabledBackground,
        shadowOpacity: 0,
        elevation: 0,
    },
    iconContainer: {
        marginLeft: 8,
    },
});
