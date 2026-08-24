import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { AuthInput } from '@/components/auth/AuthInput';
import { globalStyles } from '@/theme';
import { AuthButton } from '@/components/auth/AuthButton';
import { AuthLinkText } from '@/components/auth/AuthLinkText';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { AuthLogo } from '@/components/auth/AuthLogo';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { postLogin } from '@/collections/auth/auth.service';
import { useAuth } from '@/context/AuthContext';
import { useOnboarding } from '@/context/OnboardingContext';
import { useTranslation } from '@/context/LanguageContext';
import { AuthStackParamList } from '@/navigation/AuthNavigator';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

const LoginScreen = () => {
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const { login } = useAuth();
    const { resetOnboarding } = useOnboarding();
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        try {
            setLoading(true);

            const cleanedEmail = email.trim().toLowerCase();
            const cleanedPassword = password.trim();

            if (!cleanedEmail || !cleanedPassword) {
                Alert.alert(t('common.error'), 'Lütfen e-posta ve şifrenizi girin.');
                return;
            }

            const res = await postLogin({
                email: cleanedEmail,
                password: cleanedPassword,
            });

            console.log('Login API response:', res);

            if (res && res.user) {
                resetOnboarding();
                login(res.user);
            }
        } catch (error: any) {
            console.error('login error:', error?.response?.data || error.message);
            const msg = error?.response?.data?.message || 'Geçersiz e-posta veya şifre';
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
                    title={t('auth.login.title')}
                    description={t('auth.login.description')}
                />

                <AuthInput
                    type="email"
                    placeholder={t('auth.login.emailPlaceholder')}
                    value={email}
                    onChange={setEmail}
                />

                <AuthInput
                    type="password"
                    placeholder={t('auth.login.passwordPlaceholder')}
                    value={password}
                    onChange={setPassword}
                />

                <View style={globalStyles.linkContainer}>
                    <AuthLinkText
                        label={t('auth.login.forgotPassword')}
                        onPress={() => navigation.navigate('ForgotPassword')}
                    />
                </View>

                <AuthButton
                    label={t('auth.login.loginButton')}
                    onPress={handleLogin}
                    loading={loading}
                />

                <View style={styles.registerLinkContainer}>
                    <AuthLinkText
                        label={t('auth.login.noAccount')}
                        onPress={() => navigation.navigate('Register')}
                    />
                </View>
            </View>
        </View>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    registerLinkContainer: {
        alignItems: 'center',
        marginTop: 12,
    },
});
