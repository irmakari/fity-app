import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, TextInput } from 'react-native';
import {
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
    useFonts,
} from '@expo-google-fonts/poppins';
import AppNavigator from '@/navigation/AppNavigator';
import { AuthProvider } from '@/context/AuthContext';
import { OnboardingProvider } from '@/context/OnboardingContext';
import { fontFamily } from '@/theme';

const AppText = Text as typeof Text & {
    defaultProps?: {
        style?: unknown;
    };
};

const AppTextInput = TextInput as typeof TextInput & {
    defaultProps?: {
        style?: unknown;
    };
};

AppText.defaultProps = AppText.defaultProps || {};
AppText.defaultProps.style = [{ fontFamily: fontFamily.regular }, AppText.defaultProps.style];

AppTextInput.defaultProps = AppTextInput.defaultProps || {};
AppTextInput.defaultProps.style = [
    { fontFamily: fontFamily.regular },
    AppTextInput.defaultProps.style,
];

export default function App() {
    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_700Bold,
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <AuthProvider>
            <OnboardingProvider>
                <StatusBar style="dark" />
                <AppNavigator />
            </OnboardingProvider>
        </AuthProvider>
    );
}
