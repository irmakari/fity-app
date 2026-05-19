import { StyleSheet } from 'react-native';
import { colors, typography } from '@/theme';

export const profileDetailRowStyles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 13,
    },
    borderedRow: {
        borderBottomWidth: 1,
        borderBottomColor: '#ECF0F4',
    },
    label: {
        ...typography.helperText,
        fontSize: 13,
        color: colors.textSecondary,
        marginRight: 16,
        flex: 1,
    },
    value: {
        ...typography.label,
        fontSize: 15,
        color: colors.textPrimary,
        flexShrink: 1,
        textAlign: 'right',
    },
});
