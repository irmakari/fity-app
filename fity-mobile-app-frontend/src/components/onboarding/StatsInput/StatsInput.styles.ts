import { StyleSheet } from 'react-native';
import { colors, typography } from '@/theme';

export const statsInputStyles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 16,
    },
    label: {
        ...typography.label,
        color: colors.textPrimary,
        marginBottom: 8,
    },
    inputWrapper: {
        height: 58,
        borderRadius: 16,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: '#D8E0E8',
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#0F172A',
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
    unit: {
        ...typography.label,
        color: colors.textSecondary,
        marginLeft: 12,
    },
});
