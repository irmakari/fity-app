import React, { useMemo, useState } from 'react';
import { Alert, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthButton } from '@/components/auth/AuthButton';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthLinkText } from '@/components/auth/AuthLinkText';
import { AuthLogo } from '@/components/auth/AuthLogo';
import { useAuth } from '@/context/AuthContext';
import { useOnboarding } from '@/context/OnboardingContext';
import { AuthStackParamList } from '@/navigation/AuthNavigator';
import { registerMockUser } from '@/screens/auth/RegisterScreen/register.mock';
import { globalStyles } from '@/theme';
import { registerScreenStyles } from '@/screens/auth/RegisterScreen/RegisterScreen.styles';

type TRegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RegisterScreen = () => {
    const navigation = useNavigation<TRegisterScreenNavigationProp>();
    const { login } = useAuth();
    const { startOnboarding } = useOnboarding();

    const [fullName, setFullName] = useState(registerMockUser.fullName);
    const [email, setEmail] = useState(registerMockUser.email);
    const [password, setPassword] = useState(registerMockUser.password);
    const [confirmPassword, setConfirmPassword] = useState(registerMockUser.password);
    const [loading, setLoading] = useState(false);

    const cleanedEmail = email.trim().toLowerCase();
    const cleanedFullName = fullName.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    const validationMessage = useMemo(() => {
        if (!cleanedFullName || !cleanedEmail || !trimmedPassword || !trimmedConfirmPassword) {
            return 'All fields are required.';
        }

        if (!emailRegex.test(cleanedEmail)) {
            return 'Please enter a valid email address.';
        }

        if (trimmedPassword.length < 6) {
            return 'Password must be at least 6 characters.';
        }

        if (trimmedPassword !== trimmedConfirmPassword) {
            return 'Passwords do not match.';
        }

        return '';
    }, [cleanedEmail, cleanedFullName, trimmedConfirmPassword, trimmedPassword]);

    const handleRegister = async () => {
        if (validationMessage) {
            Alert.alert('Error', validationMessage);
            return;
        }

        try {
            setLoading(true);

            const userPayload = {
                id: `local-${Date.now()}`,
                name: cleanedFullName,
                email: cleanedEmail,
            };

            // TODO: Replace local register simulation with real register API request.
            // TODO: Persist the created user and onboarding payload when backend integration is available.
            startOnboarding();
            login(userPayload);
        } catch (error) {
            console.error('register error:', error);
            Alert.alert('Error', 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={globalStyles.container}>
            <View style={globalStyles.authContainer}>
                <AuthLogo />

                <AuthHeader
                    title="Create Account"
                    description="Set up your account to start building your workout plan."
                />

                <AuthInput
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={setFullName}
                />

                <AuthInput
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={setEmail}
                />

                <AuthInput
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={setPassword}
                />

                <AuthInput
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                />

                <AuthButton
                    label="REGISTER"
                    onPress={handleRegister}
                    loading={loading}
                    disabled={!!validationMessage}
                />

                <View style={registerScreenStyles.footerLinkContainer}>
                    <AuthLinkText
                        label="Already have an account? Login"
                        onPress={() => navigation.navigate('Login')}
                    />
                </View>
            </View>
        </View>
    );
};

export default RegisterScreen;
