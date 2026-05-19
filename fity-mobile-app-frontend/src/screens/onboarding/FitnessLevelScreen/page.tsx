import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SelectableCard } from '@/components/onboarding/SelectableCard';
import { OnboardingScreenLayout } from '@/components/onboarding/OnboardingScreenLayout';
import { useOnboarding } from '@/context/OnboardingContext';
import { OnboardingStackParamList } from '@/navigation/OnboardingNavigator';
import { onboardingFitnessLevelsMock } from '@/screens/onboarding/mock/onboarding.mock';
import { fitnessLevelScreenStyles } from '@/screens/onboarding/FitnessLevelScreen/FitnessLevelScreen.styles';

type TFitnessLevelNavigationProp = NativeStackNavigationProp<
    OnboardingStackParamList,
    'FitnessLevel'
>;

const FitnessLevelScreen = () => {
    const navigation = useNavigation<TFitnessLevelNavigationProp>();
    const { onboardingPayload, updateOnboardingPayload } = useOnboarding();

    return (
        <OnboardingScreenLayout
            currentStep={2}
            totalSteps={7}
            title="What is your fitness level?"
            onContinue={() => navigation.navigate('WorkoutFrequency')}
            onBack={() => navigation.goBack()}
        >
            <View style={fitnessLevelScreenStyles.optionList}>
                {onboardingFitnessLevelsMock.map((fitnessLevelOption) => (
                    <SelectableCard
                        key={fitnessLevelOption.id}
                        title={fitnessLevelOption.title}
                        description={fitnessLevelOption.description}
                        iconName={fitnessLevelOption.iconName}
                        selected={onboardingPayload.fitnessLevel === fitnessLevelOption.value}
                        onPress={() => updateOnboardingPayload({ fitnessLevel: fitnessLevelOption.value })}
                        compact
                    />
                ))}
            </View>
        </OnboardingScreenLayout>
    );
};

export default FitnessLevelScreen;
