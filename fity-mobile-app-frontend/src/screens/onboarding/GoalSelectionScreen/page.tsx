import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SelectableCard } from '@/components/onboarding/SelectableCard';
import { OnboardingScreenLayout } from '@/components/onboarding/OnboardingScreenLayout';
import { useOnboarding } from '@/context/OnboardingContext';
import { OnboardingStackParamList } from '@/navigation/OnboardingNavigator';
import { onboardingGoalsMock } from '@/screens/onboarding/mock/onboarding.mock';
import { goalSelectionScreenStyles } from '@/screens/onboarding/GoalSelectionScreen/GoalSelectionScreen.styles';

type TGoalSelectionNavigationProp = NativeStackNavigationProp<
    OnboardingStackParamList,
    'GoalSelection'
>;

const GoalSelectionScreen = () => {
    const navigation = useNavigation<TGoalSelectionNavigationProp>();
    const { onboardingPayload, updateOnboardingPayload } = useOnboarding();

    const handleContinue = () => {
        navigation.navigate('FitnessLevel');
    };

    return (
        <OnboardingScreenLayout
            currentStep={1}
            totalSteps={7}
            title="What is your goal?"
            description="This helps us build your personalized workout plan."
            onContinue={handleContinue}
        >
            <View style={goalSelectionScreenStyles.optionGrid}>
                {onboardingGoalsMock.map((goalOption) => (
                    <SelectableCard
                        key={goalOption.id}
                        title={goalOption.title}
                        description={goalOption.description}
                        iconName={goalOption.iconName}
                        selected={onboardingPayload.goal === goalOption.value}
                        onPress={() => updateOnboardingPayload({ goal: goalOption.value })}
                    />
                ))}
            </View>
        </OnboardingScreenLayout>
    );
};

export default GoalSelectionScreen;
