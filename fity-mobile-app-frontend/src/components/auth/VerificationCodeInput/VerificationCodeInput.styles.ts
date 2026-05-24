import { StyleSheet } from 'react-native';

export const verificationCodeInputStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
    },
    input: {
        width: 48,
        height: 56,
        borderWidth: 1,
        borderColor: '#D9D9D9',
        borderRadius: 12,
        textAlign: 'center',
        fontSize: 22,
        fontWeight: '600',
        color: '#1F1F1F',
        backgroundColor: '#FFFFFF',
    },
    inputFilled: {
        borderColor: '#5B5CE2',
    },
    inputError: {
        borderColor: '#FF4D4F',
    },
});