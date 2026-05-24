import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SelectableCard } from '@/components/onboarding/SelectableCard';
import { OnboardingScreenLayout } from '@/components/onboarding/OnboardingScreenLayout';
import { useOnboarding } from '@/context/OnboardingContext';
import { OnboardingStackParamList } from '@/navigation/OnboardingNavigator';
import { onboardingWorkoutDaysMock } from '@/screens/onboarding/mock/onboarding.mock';
import { workoutFrequencyScreenStyles } from '@/screens/onboarding/WorkoutFrequencyScreen/WorkoutFrequencyScreen.styles';

type TWorkoutFrequencyNavigationProp = NativeStackNavigationProp<
    OnboardingStackParamList,
    'WorkoutFrequency'
>;

const WorkoutFrequencyScreen = () => {
    const navigation = useNavigation<TWorkoutFrequencyNavigationProp>();
    const { onboardingPayload, updateOnboardingPayload } = useOnboarding();

    return (
        <OnboardingScreenLayout
            currentStep={3}
            totalSteps={7}
            title="How many days per week can you train?"
            onContinue={() => navigation.navigate('TrainingLocation')}
            onBack={() => navigation.goBack()}
        >
            <View style={workoutFrequencyScreenStyles.grid}>
                {onboardingWorkoutDaysMock.map((workoutDayOption) => (
                    <View key={workoutDayOption.id} style={workoutFrequencyScreenStyles.gridItem}>
                        <SelectableCard
                            title={workoutDayOption.title}
                            iconName={workoutDayOption.iconName}
                            selected={onboardingPayload.workoutDays === workoutDayOption.value}
                            onPress={() => updateOnboardingPayload({ workoutDays: workoutDayOption.value })}
                            compact
                        />
                    </View>
                ))}
            </View>
        </OnboardingScreenLayout>
    );
};

export default WorkoutFrequencyScreen;
