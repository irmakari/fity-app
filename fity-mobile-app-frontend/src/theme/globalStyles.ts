import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: 16,
        paddingTop: 64,
        gap:16,
    },
    authContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingVertical: 40,
    },
    linkContainer: {
        alignItems: 'flex-end',
        marginTop: 12,
        marginBottom: 24,
    },
});