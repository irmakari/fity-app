import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingScreenLayout } from '@/components/onboarding/OnboardingScreenLayout';
import { StatsInput } from '@/components/onboarding/StatsInput';
import { useOnboarding } from '@/context/OnboardingContext';
import { OnboardingStackParamList } from '@/navigation/OnboardingNavigator';
import { physicalStatsScreenStyles } from '@/screens/onboarding/PhysicalStatsScreen/PhysicalStatsScreen.styles';

type TPhysicalStatsNavigationProp = NativeStackNavigationProp<
    OnboardingStackParamList,
    'PhysicalStats'
>;

const getInitialValue = (value: number) => (value ? String(value) : '');

const PhysicalStatsScreen = () => {
    const navigation = useNavigation<TPhysicalStatsNavigationProp>();
    const { onboardingPayload, updatePhysicalStats } = useOnboarding();

    const [age, setAge] = useState(getInitialValue(onboardingPayload.physicalStats.age));
    const [height, setHeight] = useState(getInitialValue(onboardingPayload.physicalStats.height));
    const [currentWeight, setCurrentWeight] = useState(
        getInitialValue(onboardingPayload.physicalStats.currentWeight),
    );
    const [targetWeight, setTargetWeight] = useState(
        getInitialValue(onboardingPayload.physicalStats.targetWeight),
    );

    const handleContinue = () => {
        updatePhysicalStats({
            age: Number(age) || 0,
            height: Number(height) || 0,
            currentWeight: Number(currentWeight) || 0,
            targetWeight: Number(targetWeight) || 0,
        });

        navigation.navigate('WorkoutPlanReady');
    };

    return (
        <OnboardingScreenLayout
            currentStep={6}
            totalSteps={7}
            title="Tell us about your physical stats"
            onContinue={handleContinue}
            onBack={() => navigation.goBack()}
            keyboardAvoiding
        >
            <View style={physicalStatsScreenStyles.form}>
                <StatsInput
                    label="Age"
                    placeholder="Enter your age"
                    value={age}
                    onChange={setAge}
                    unit="yrs"
                />

                <StatsInput
                    label="Height"
                    placeholder="Enter your height"
                    value={height}
                    onChange={setHeight}
                    unit="cm"
                />

                <StatsInput
                    label="Current Weight"
                    placeholder="Enter current weight"
                    value={currentWeight}
                    onChange={setCurrentWeight}
                    unit="kg"
                />

                <StatsInput
                    label="Target Weight"
                    placeholder="Enter target weight"
                    value={targetWeight}
                    onChange={setTargetWeight}
                    unit="kg"
                />
            </View>
        </OnboardingScreenLayout>
    );
};

export default PhysicalStatsScreen;
