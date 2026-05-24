import { StyleSheet } from 'react-native';
import { colors, typography } from '@/theme';

export const multiSelectCardStyles = StyleSheet.create({
    card: {
        minHeight: 94,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#D8E0E8',
        backgroundColor: colors.surface,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#0F172A',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        elevation: 2,
    },
    selectedCard: {
        borderColor: colors.primaryButton,
        backgroundColor: '#EEF6FF',
        shadowOpacity: 0.1,
        elevation: 4,
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 12,
    },
    iconWrapper: {
        width: 42,
        height: 42,
        borderRadius: 14,
        backgroundColor: '#F5F7FA',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    selectedIconWrapper: {
        backgroundColor: '#DDEEFF',
    },
    title: {
        ...typography.label,
        fontSize: 16,
        color: colors.textPrimary,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#C3CED9',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surface,
    },
    selectedCheckbox: {
        borderColor: colors.primaryButton,
        backgroundColor: colors.primaryButton,
    },
});
