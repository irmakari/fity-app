import React from 'react';
import { Pressable, Text } from 'react-native';
import { AuthLinkTextProps } from './AuthLinkText.type';
import { authLinkTextStyles } from './AuthLinkText.styles';

const AuthLinkText = ({
                          label,
                          onPress,
                          disabled = false,
                      }: AuthLinkTextProps) => {
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={authLinkTextStyles.button}
        >
            <Text
                style={[
                    authLinkTextStyles.text,
                    disabled && authLinkTextStyles.disabledText,
                ]}
            >
                {label}
            </Text>
        </Pressable>
    );
};

export default AuthLinkText;