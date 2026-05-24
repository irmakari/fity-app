import React, { useState } from 'react';
import { Text, TextInput, View, Pressable } from 'react-native';
import { AuthInputProps } from './AuthInput.type';
import { authInputStyles } from './AuthInput.styles';
import { colors } from '@/theme';
import { MaterialIcons } from '@expo/vector-icons';

const AuthInput = ({
                       value,
                       onChange,
                       placeholder,
                       label,
                       type = 'text',
                       error = false,
                       disabled = false,
                       required = false,
                   }: AuthInputProps) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const renderInput = () => {
        if (type === 'email') {
            return (
                <View style={[
                    authInputStyles.inputWrapper,
                    error && authInputStyles.inputError,
                    disabled && authInputStyles.inputDisabled,
                ]}>
                    <TextInput
                        value={value}
                        onChangeText={onChange}
                        placeholder={placeholder}
                        editable={!disabled}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        style={authInputStyles.input}
                        placeholderTextColor={colors.inputPlaceholder}
                    />
                </View>
            );
        }

        if (type === 'password') {
            return (
                <View style={[
                    authInputStyles.inputWrapper,
                    error && authInputStyles.inputError,
                    disabled && authInputStyles.inputDisabled,
                ]}>
                    <TextInput
                        value={value}
                        onChangeText={onChange}
                        placeholder={placeholder}
                        editable={!disabled}
                        secureTextEntry={!isPasswordVisible}
                        autoCapitalize="none"
                        autoCorrect={false}
                        style={authInputStyles.input}
                        placeholderTextColor={colors.inputPlaceholder}
                    />
                    <Pressable
                        onPress={togglePasswordVisibility}
                        style={authInputStyles.iconContainer}
                    >
                        <MaterialIcons
                            name={isPasswordVisible ? "visibility" : "visibility-off"}
                            size={24}
                            color="#94929C"
                        />
                    </Pressable>
                </View>
            );
        }

        return (
            <View style={[
                authInputStyles.inputWrapper,
                error && authInputStyles.inputError,
                disabled && authInputStyles.inputDisabled,
            ]}>
                <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder={placeholder}
                    editable={!disabled}
                    autoCapitalize="sentences"
                    style={authInputStyles.input}
                    placeholderTextColor={colors.inputPlaceholder}
                />
            </View>
        );
    };

    return (
        <View style={authInputStyles.container}>
            {!!label && (
                <Text style={authInputStyles.label}>
                    {label}
                    {required ? ' *' : ''}
                </Text>
            )}
            {renderInput()}
        </View>
    );
};

export default AuthInput;