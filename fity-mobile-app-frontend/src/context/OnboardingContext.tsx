import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import {
    TOnboardingPayload,
    TOnboardingPhysicalStats,
} from '@/screens/onboarding/types/onboarding.type';

type TOnboardingContextType = {
    shouldShowOnboarding: boolean;
    hasCompletedOnboarding: boolean;
    onboardingPayload: TOnboardingPayload;
    updateOnboardingPayload: (payload: Partial<TOnboardingPayload>) => void;
    updatePhysicalStats: (stats: Partial<TOnboardingPhysicalStats>) => void;
    startOnboarding: () => void;
    completeOnboarding: () => void;
    resetOnboarding: () => void;
};

const initialOnboardingPayload: TOnboardingPayload = {
    goal: '',
    fitnessLevel: '',
    workoutDays: 0,
    trainingLocation: '',
    focusMuscles: [],
    physicalStats: {
        age: 0,
        height: 0,
        currentWeight: 0,
        targetWeight: 0,
    },
};

const OnboardingContext = createContext<TOnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
    const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false);
    const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
    const [onboardingPayload, setOnboardingPayload] = useState<TOnboardingPayload>(
        initialOnboardingPayload,
    );

    const updateOnboardingPayload = (payload: Partial<TOnboardingPayload>) => {
        setOnboardingPayload((previousPayload) => ({
            ...previousPayload,
            ...payload,
        }));
    };

    const updatePhysicalStats = (stats: Partial<TOnboardingPhysicalStats>) => {
        setOnboardingPayload((previousPayload) => ({
            ...previousPayload,
            physicalStats: {
                ...previousPayload.physicalStats,
                ...stats,
            },
        }));
    };

    const startOnboarding = () => {
        setShouldShowOnboarding(true);
        setHasCompletedOnboarding(false);
        setOnboardingPayload(initialOnboardingPayload);
    };

    const completeOnboarding = () => {
        // TODO: Send onboardingPayload to the onboarding/profile endpoint when backend integration is ready.
        setShouldShowOnboarding(false);
        setHasCompletedOnboarding(true);
    };

    const resetOnboarding = () => {
        setShouldShowOnboarding(false);
        setHasCompletedOnboarding(false);
        setOnboardingPayload(initialOnboardingPayload);
    };

    const value = useMemo(
        () => ({
            shouldShowOnboarding,
            hasCompletedOnboarding,
            onboardingPayload,
            updateOnboardingPayload,
            updatePhysicalStats,
            startOnboarding,
            completeOnboarding,
            resetOnboarding,
        }),
        [hasCompletedOnboarding, onboardingPayload, shouldShowOnboarding],
    );

    return (
        <OnboardingContext.Provider value={value}>
            {children}
        </OnboardingContext.Provider>
    );
};

export const useOnboarding = () => {
    const context = useContext(OnboardingContext);

    if (context === undefined) {
        throw new Error('useOnboarding must be used within an OnboardingProvider');
    }

    return context;
};
