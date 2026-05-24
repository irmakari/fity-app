import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
        gap: 12,
        paddingVertical: 20,
    },
    button: {
        width: '48%',
        backgroundColor: '#D1E3FF',
        paddingVertical: 20,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
    },
});
