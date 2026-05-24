import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AuthHeader } from '@/components/auth/AuthHeader';
import { AuthButton } from '@/components/auth/AuthButton';
import { VerificationCodeInput } from '@/components/auth/VerificationCodeInput';
import { globalStyles } from '@/theme';

const ForgotPassword = () => {
    const [code, setCode] = useState('');

    const handleVerifyCode = () => {
        console.log('Verification code:', code);
    };

    return (
        <View style={globalStyles.container}>
            <View style={globalStyles.authContainer}>
                <AuthHeader
                    title="Enter Verification Code"
                    description="We sent a 6-digit code to your email."
                />

                <View style={styles.codeWrapper}>
                    <VerificationCodeInput
                        value={code}
                        onChange={setCode}
                        length={6}
                    />
                </View>

                <AuthButton
                    label="Verify Code"
                    onPress={handleVerifyCode}
                    disabled={code.length !== 6}
                />
            </View>
        </View>
    );
};

export default ForgotPassword;

const styles = StyleSheet.create({
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    codeWrapper: {
        marginTop: 32,
        marginBottom: 40,
        alignItems: 'center',
    },
});