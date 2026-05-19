import React from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme';
import { BottomActionButton } from '@/components/onboarding/BottomActionButton';
import { OnboardingHeader } from '@/components/onboarding/OnboardingHeader';
import { StepProgress } from '@/components/onboarding/StepProgress';
import { onboardingScreenLayoutStyles } from '@/components/onboarding/OnboardingScreenLayout/OnboardingScreenLayout.styles';
import { TOnboardingScreenLayoutProps } from '@/components/onboarding/OnboardingScreenLayout/OnboardingScreenLayout.type';

const OnboardingScreenLayout = ({
    currentStep,
    totalSteps,
    title,
    description,
    children,
    continueLabel = 'Continue',
    continueDisabled = false,
    onContinue,
    onBack,
    keyboardAvoiding = false,
    contentContainerStyle,
}: TOnboardingScreenLayoutProps) => {
    const content = (
        <View style={onboardingScreenLayoutStyles.container}>
            <View style={onboardingScreenLayoutStyles.topRow}>
                {!!onBack && (
                    <Pressable
                        onPress={onBack}
                        style={onboardingScreenLayoutStyles.backButton}
                    >
                        <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
                    </Pressable>
                )}
            </View>

            <StepProgress currentStep={currentStep} totalSteps={totalSteps} />

            <OnboardingHeader title={title} description={description} />

            <ScrollView
                bounces={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    onboardingScreenLayoutStyles.scrollContent,
                    contentContainerStyle,
                ]}
                keyboardShouldPersistTaps="handled"
            >
                {children}
            </ScrollView>

            <View style={onboardingScreenLayoutStyles.bottomContainer}>
                <BottomActionButton
                    label={continueLabel}
                    onPress={onContinue}
                    disabled={continueDisabled}
                />
            </View>
        </View>
    );

    return (
        <SafeAreaView edges={['top', 'bottom']} style={onboardingScreenLayoutStyles.safeArea}>
            {keyboardAvoiding ? (
                <KeyboardAvoidingView
                    style={onboardingScreenLayoutStyles.keyboardContainer}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    {content}
                </KeyboardAvoidingView>
            ) : (
                content
            )}
        </SafeAreaView>
    );
};

export default OnboardingScreenLayout;
