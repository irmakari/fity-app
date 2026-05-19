import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

export type TOnboardingScreenLayoutProps = {
    currentStep: number;
    totalSteps: number;
    title: string;
    description?: string;
    children: ReactNode;
    continueLabel?: string;
    continueDisabled?: boolean;
    onContinue: () => void;
    onBack?: () => void;
    keyboardAvoiding?: boolean;
    contentContainerStyle?: StyleProp<ViewStyle>;
};
