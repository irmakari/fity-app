import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MultiSelectCard } from '@/components/onboarding/MultiSelectCard';
import { OnboardingScreenLayout } from '@/components/onboarding/OnboardingScreenLayout';
import { useOnboarding } from '@/context/OnboardingContext';
import { OnboardingStackParamList } from '@/navigation/OnboardingNavigator';
import { onboardingFocusMusclesMock } from '@/screens/onboarding/mock/onboarding.mock';
import { focusMuscleScreenStyles } from '@/screens/onboarding/FocusMuscleScreen/FocusMuscleScreen.styles';

type TFocusMuscleNavigationProp = NativeStackNavigationProp<
    OnboardingStackParamList,
    'FocusMuscle'
>;

const FocusMuscleScreen = () => {
    const navigation = useNavigation<TFocusMuscleNavigationProp>();
    const { onboardingPayload, updateOnboardingPayload } = useOnboarding();

    const handleToggleMuscle = (muscleValue: string) => {
        const nextFocusMuscles = onboardingPayload.focusMuscles.includes(muscleValue)
            ? onboardingPayload.focusMuscles.filter((muscle) => muscle !== muscleValue)
            : [...onboardingPayload.focusMuscles, muscleValue];

        updateOnboardingPayload({ focusMuscles: nextFocusMuscles });
    };

    return (
        <OnboardingScreenLayout
            currentStep={5}
            totalSteps={7}
            title="Which muscles do you want to focus on?"
            onContinue={() => navigation.navigate('PhysicalStats')}
            onBack={() => navigation.goBack()}
        >
            <View style={focusMuscleScreenStyles.optionList}>
                {onboardingFocusMusclesMock.map((focusMuscleOption) => (
                    <MultiSelectCard
                        key={focusMuscleOption.id}
                        title={focusMuscleOption.title}
                        iconName={focusMuscleOption.iconName}
                        selected={onboardingPayload.focusMuscles.includes(String(focusMuscleOption.value))}
                        onPress={() => handleToggleMuscle(String(focusMuscleOption.value))}
                    />
                ))}
            </View>
        </OnboardingScreenLayout>
    );
};

export default FocusMuscleScreen;
