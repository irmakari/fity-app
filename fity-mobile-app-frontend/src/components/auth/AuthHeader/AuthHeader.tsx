import React from 'react';
import { Text, View } from 'react-native';
import { AuthHeaderProps } from './AuthHeader.type';
import { authHeaderStyles } from './AuthHeader.styles';

const AuthHeader = ({
                        title,
                        description,
                    }: AuthHeaderProps) => {
    return (
        <View style={authHeaderStyles.container}>
            <Text style={authHeaderStyles.title}>{title}</Text>

            {!!description && (
                <Text style={authHeaderStyles.description}>
                    {description}
                </Text>
            )}
        </View>
    );
};

export default AuthHeader;