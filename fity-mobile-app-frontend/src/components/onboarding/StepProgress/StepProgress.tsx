import React from 'react';
import { Text, View } from 'react-native';
import { stepProgressStyles } from '@/components/onboarding/StepProgress/StepProgress.styles';
import { TStepProgressProps } from '@/components/onboarding/StepProgress/StepProgress.type';

const StepProgress = ({
    currentStep,
    totalSteps,
}: TStepProgressProps) => {
    const progress = Math.max(0, Math.min(currentStep / totalSteps, 1));

    return (
        <View style={stepProgressStyles.container}>
            <Text style={stepProgressStyles.label}>
                Step {currentStep} of {totalSteps}
            </Text>

            <View style={stepProgressStyles.track}>
                <View
                    style={[
                        stepProgressStyles.fill,
                        { width: `${progress * 100}%` },
                    ]}
                />
            </View>
        </View>
    );
};

export default StepProgress;
