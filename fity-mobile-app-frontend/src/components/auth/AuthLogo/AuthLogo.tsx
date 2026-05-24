import React from 'react';
import { Image, Text, View } from 'react-native';
import { AuthLogoProps } from './AuthLogo.type';
import { authLogoStyles } from './AuthLogo.styles';

const AuthLogo = ({
                      showText = false,
                  }: AuthLogoProps) => {
    return (
        <View style={authLogoStyles.container}>
            <Image
                source={require('../../../assests/logo/logo-with-text.png')}
                style={authLogoStyles.logo}
            />

            {showText && (
                <Text style={authLogoStyles.text}>FITY</Text>
            )}
        </View>
    );
};

export default AuthLogo;