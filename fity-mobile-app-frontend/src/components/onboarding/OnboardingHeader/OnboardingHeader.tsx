import React from 'react';
import { Text, View } from 'react-native';
import { onboardingHeaderStyles } from '@/components/onboarding/OnboardingHeader/OnboardingHeader.styles';
import { TOnboardingHeaderProps } from '@/components/onboarding/OnboardingHeader/OnboardingHeader.type';

const OnboardingHeader = ({
    title,
    description,
}: TOnboardingHeaderProps) => {
    return (
        <View style={onboardingHeaderStyles.container}>
            <Text style={onboardingHeaderStyles.title}>{title}</Text>

            {!!description && (
                <Text style={onboardingHeaderStyles.description}>{description}</Text>
            )}
        </View>
    );
};

export default OnboardingHeader;
