import React from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingScreenLayout } from '@/components/onboarding/OnboardingScreenLayout';
import { WorkoutPlanPreviewCard } from '@/components/onboarding/WorkoutPlanPreviewCard';
import { useOnboarding } from '@/context/OnboardingContext';
import { OnboardingStackParamList } from '@/navigation/OnboardingNavigator';
import { MainStackParamList } from '@/navigation/MainNavigator';
import { getWorkoutPlanPreview } from '@/screens/onboarding/mock/onboarding.mock';
import { workoutPlanReadyScreenStyles } from '@/screens/onboarding/WorkoutPlanReadyScreen/WorkoutPlanReadyScreen.styles';

type TWorkoutPlanReadyNavigationProp = NativeStackNavigationProp<
    OnboardingStackParamList,
    'WorkoutPlanReady'
>;

const formatSummaryValue = (value: string) =>
    value
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

const WorkoutPlanReadyScreen = () => {
    const navigation = useNavigation<TWorkoutPlanReadyNavigationProp>();
    const { onboardingPayload, completeOnboarding } = useOnboarding();

    const previewWorkoutDays = getWorkoutPlanPreview(onboardingPayload);

    const handleStartTraining = () => {
        completeOnboarding();

        navigation.getParent<NativeStackNavigationProp<MainStackParamList>>()?.reset({
            index: 0,
            routes: [{ name: 'MainTabs' }],
        });
    };

    return (
        <OnboardingScreenLayout
            currentStep={7}
            totalSteps={7}
            title="Your workout plan is ready!"
            description="We used your selections to build a weekly plan you can start right away."
            continueLabel="Start Training"
            onContinue={handleStartTraining}
            onBack={() => navigation.goBack()}
        >
            <View style={workoutPlanReadyScreenStyles.content}>
                <View style={workoutPlanReadyScreenStyles.summaryCard}>
                    <Text style={workoutPlanReadyScreenStyles.summaryTitle}>
                        Personalized summary
                    </Text>

                    <Text style={workoutPlanReadyScreenStyles.summaryText}>
                        Goal: {onboardingPayload.goal ? formatSummaryValue(onboardingPayload.goal) : '-'} {'\n'}
                        Level: {onboardingPayload.fitnessLevel ? formatSummaryValue(onboardingPayload.fitnessLevel) : '-'} {'\n'}
                        Training location: {onboardingPayload.trainingLocation ? formatSummaryValue(onboardingPayload.trainingLocation) : '-'} {'\n'}
                        Workout days: {onboardingPayload.workoutDays || 0} per week
                    </Text>
                </View>

                <WorkoutPlanPreviewCard workoutDays={previewWorkoutDays} />
            </View>
        </OnboardingScreenLayout>
    );
};

export default WorkoutPlanReadyScreen;
