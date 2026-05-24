import React from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import { AuthButtonProps } from './AuthButton.type';
import { authButtonStyles } from './AuthButton.styles';
import { colors } from '@/theme';

const AuthButton = ({
                        label,
                        onPress,
                        disabled = false,
                        loading = false,
                        fullWidth = true,
                    }: AuthButtonProps) => {
    const isDisabled = disabled || loading;

    return (
        <Pressable
            onPress={onPress}
            disabled={isDisabled}
            style={[
                authButtonStyles.button,
                fullWidth && authButtonStyles.fullWidth,
                isDisabled && authButtonStyles.disabledButton,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={colors.surface} />
            ) : (
                <Text
                    style={[
                        authButtonStyles.text,
                        isDisabled && authButtonStyles.disabledText,
                    ]}
                >
                    {label}
                </Text>
            )}
        </Pressable>
    );
};

export default AuthButton;