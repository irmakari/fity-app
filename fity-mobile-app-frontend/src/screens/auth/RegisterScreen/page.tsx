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
import { useTranslation } from '@/context/LanguageContext';
import { AuthStackParamList } from '@/navigation/AuthNavigator';
import { postRegister } from '@/collections/auth/auth.service';
import { globalStyles } from '@/theme';
import { registerScreenStyles } from '@/screens/auth/RegisterScreen/RegisterScreen.styles';

type TRegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RegisterScreen = () => {
    const navigation = useNavigation<TRegisterScreenNavigationProp>();
    const { login } = useAuth();
    const { startOnboarding } = useOnboarding();
    const { t } = useTranslation();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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

        if (trimmedPassword.length < 8) {
            return 'Password must be at least 8 characters.';
        }

        if (trimmedPassword !== trimmedConfirmPassword) {
            return 'Passwords do not match.';
        }

        return '';
    }, [cleanedEmail, cleanedFullName, trimmedConfirmPassword, trimmedPassword]);

    const handleRegister = async () => {
        if (validationMessage) {
            Alert.alert(t('common.error'), validationMessage);
            return;
        }

        try {
            setLoading(true);

            const res = await postRegister({
                name: cleanedFullName,
                email: cleanedEmail,
                password: trimmedPassword,
            });

            console.log('Register API success:', res);
            startOnboarding();
            login(res.user);
        } catch (error: any) {
            console.error('register error:', error?.response?.data || error.message);
            const msg = error?.response?.data?.message || 'Registration failed. Check password requirements (Min 8 chars, 1 Upper, 1 Lower, 1 Number, 1 Special Char).';
            Alert.alert(t('common.error'), msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={globalStyles.container}>
            <View style={globalStyles.authContainer}>
                <AuthLogo />

                <AuthHeader
                    title={t('auth.register.title')}
                    description={t('auth.register.description')}
                />

                <AuthInput
                    type="text"
                    placeholder={t('auth.register.namePlaceholder')}
                    value={fullName}
                    onChange={setFullName}
                />

                <AuthInput
                    type="email"
                    placeholder={t('auth.register.emailPlaceholder')}
                    value={email}
                    onChange={setEmail}
                />

                <AuthInput
                    type="password"
                    placeholder={t('auth.register.passwordPlaceholder')}
                    value={password}
                    onChange={setPassword}
                />

                <AuthInput
                    type="password"
                    placeholder={t('auth.register.confirmPasswordPlaceholder')}
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                />

                <AuthButton
                    label={t('auth.register.registerButton')}
                    onPress={handleRegister}
                    loading={loading}
                    disabled={!!validationMessage}
                />

                <View style={registerScreenStyles.footerLinkContainer}>
                    <AuthLinkText
                        label={t('auth.register.alreadyHaveAccount')}
                        onPress={() => navigation.navigate('Login')}
                    />
                </View>
            </View>
        </View>
    );
};

export default RegisterScreen;
