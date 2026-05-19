import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SelectableCard } from '@/components/onboarding/SelectableCard';
import { OnboardingScreenLayout } from '@/components/onboarding/OnboardingScreenLayout';
import { useOnboarding } from '@/context/OnboardingContext';
import { OnboardingStackParamList } from '@/navigation/OnboardingNavigator';
import { onboardingLocationsMock } from '@/screens/onboarding/mock/onboarding.mock';
import { trainingLocationScreenStyles } from '@/screens/onboarding/TrainingLocationScreen/TrainingLocationScreen.styles';

type TTrainingLocationNavigationProp = NativeStackNavigationProp<
    OnboardingStackParamList,
    'TrainingLocation'
>;

const TrainingLocationScreen = () => {
    const navigation = useNavigation<TTrainingLocationNavigationProp>();
    const { onboardingPayload, updateOnboardingPayload } = useOnboarding();

    return (
        <OnboardingScreenLayout
            currentStep={4}
            totalSteps={7}
            title="Where will you train?"
            onContinue={() => navigation.navigate('FocusMuscle')}
            onBack={() => navigation.goBack()}
        >
            <View style={trainingLocationScreenStyles.optionList}>
                {onboardingLocationsMock.map((locationOption) => (
                    <SelectableCard
                        key={locationOption.id}
                        title={locationOption.title}
                        description={locationOption.description}
                        iconName={locationOption.iconName}
                        selected={onboardingPayload.trainingLocation === locationOption.value}
                        onPress={() => updateOnboardingPayload({ trainingLocation: locationOption.value })}
                    />
                ))}
            </View>
        </OnboardingScreenLayout>
    );
};

export default TrainingLocationScreen;
