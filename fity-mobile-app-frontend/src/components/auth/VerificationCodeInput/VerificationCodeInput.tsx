import React, { useMemo, useRef } from 'react';
import { TextInput, View } from 'react-native';
import { verificationCodeInputStyles as styles } from '@/components/auth/VerificationCodeInput/VerificationCodeInput.styles';
import { VerificationCodeInputProps } from '@/components/auth/VerificationCodeInput/VerificationCodeInput.type';

export const VerificationCodeInput = ({
                                          length = 6,
                                          value,
                                          onChange,
                                          error,
                                          disabled = false,
                                      }: VerificationCodeInputProps) => {
    const inputsRef = useRef<Array<TextInput | null>>([]);

    const codeArray = useMemo(() => {
        return Array.from({ length }, (_, index) => value[index] || '');
    }, [value, length]);

    const handleChangeText = (text: string, index: number) => {
        const sanitizedText = text.replace(/\D/g, '');

        if (!sanitizedText) {
            const newValueArray = value.split('');
            newValueArray[index] = '';
            onChange(newValueArray.join(''));
            return;
        }

        const digit = sanitizedText[sanitizedText.length - 1];
        const newValueArray = value.split('');

        while (newValueArray.length < length) {
            newValueArray.push('');
        }

        newValueArray[index] = digit;
        const newValue = newValueArray.join('').slice(0, length);

        onChange(newValue);

        if (index < length - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (
        key: string,
        index: number,
    ) => {
        if (key !== 'Backspace') return;

        const currentValue = value[index];

        if (currentValue) {
            const newValueArray = value.split('');
            newValueArray[index] = '';
            onChange(newValueArray.join(''));
            return;
        }

        if (index > 0) {
            const newValueArray = value.split('');
            newValueArray[index - 1] = '';
            onChange(newValueArray.join(''));
            inputsRef.current[index - 1]?.focus();
        }
    };

    return (
        <View style={styles.container}>
            {codeArray.map((digit, index) => {
                const inputStyles = [
                    styles.input,
                    digit ? styles.inputFilled : null,
                    error ? styles.inputError : null,
                ];

                return (
                    <TextInput
                        key={index}
                        ref={(ref) => {
                            inputsRef.current[index] = ref;
                        }}
                        style={inputStyles}
                        value={digit}
                        onChangeText={(text) => handleChangeText(text, index)}
                        onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                        keyboardType="number-pad"
                        maxLength={1}
                        editable={!disabled}
                        selectTextOnFocus
                        textContentType="oneTimeCode"
                        autoComplete="sms-otp"
                        returnKeyType="done"
                    />
                );
            })}
        </View>
    );
};