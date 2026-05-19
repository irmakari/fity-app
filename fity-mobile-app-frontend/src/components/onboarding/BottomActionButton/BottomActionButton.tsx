import React from 'react';
import { Pressable, Text } from 'react-native';
import { bottomActionButtonStyles } from '@/components/onboarding/BottomActionButton/BottomActionButton.styles';
import { TBottomActionButtonProps } from '@/components/onboarding/BottomActionButton/BottomActionButton.type';

const BottomActionButton = ({
    label,
    onPress,
    disabled = false,
}: TBottomActionButtonProps) => {
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={[
                bottomActionButtonStyles.button,
                disabled && bottomActionButtonStyles.disabledButton,
            ]}
        >
            <Text
                style={[
                    bottomActionButtonStyles.label,
                    disabled && bottomActionButtonStyles.disabledLabel,
                ]}
            >
                {label}
            </Text>
        </Pressable>
    );
};

export default BottomActionButton;
