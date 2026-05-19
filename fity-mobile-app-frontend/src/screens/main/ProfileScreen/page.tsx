import React, { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { globalStyles } from '@/theme';
import { useAuth } from '@/context/AuthContext';
import { useOnboarding } from '@/context/OnboardingContext';
import { ProfileSummaryCard } from '@/components/main/ProfileSummaryCard';
import { ProfileDetailRow } from '@/components/main/ProfileDetailRow';
import { ProfileStatCard } from '@/components/main/ProfileStatCard';
import { profileScreenStyles } from '@/screens/main/ProfileScreen/ProfileScreen.styles';

const formatValue = (value: string, fallback = 'Not set yet') => {
    if (!value) {
        return fallback;
    }

    return value
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const getInitials = (name: string) => {
    const parts = name.trim().split(' ').filter(Boolean);

    if (!parts.length) {
        return 'FT';
    }

    return parts
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');
};

const ProfileScreenPage = () => {
    const { user, logout } = useAuth();
    const { onboardingPayload, hasCompletedOnboarding } = useOnboarding();

    const profileName = user?.name || 'Fity User';
    const profileEmail = user?.email || 'no-email@example.com';
    const focusMuscles = onboardingPayload.focusMuscles.length
        ? onboardingPayload.focusMuscles
        : ['full_body'];

    const profileSubtitle = hasCompletedOnboarding
        ? `${formatValue(onboardingPayload.goal, 'Personalized plan')} journey`
        : 'Profile created with local data';

    const stats = useMemo(
        () => [
            {
                label: 'Age',
                value: onboardingPayload.physicalStats.age
                    ? `${onboardingPayload.physicalStats.age}`
                    : '--',
                accentColor: '#2563EB',
            },
            {
                label: 'Height',
                value: onboardingPayload.physicalStats.height
                    ? `${onboardingPayload.physicalStats.height} cm`
                    : '--',
                accentColor: '#7C3AED',
            },
            {
                label: 'Current Weight',
                value: onboardingPayload.physicalStats.currentWeight
                    ? `${onboardingPayload.physicalStats.currentWeight} kg`
                    : '--',
                accentColor: '#F97316',
            },
            {
                label: 'Target Weight',
                value: onboardingPayload.physicalStats.targetWeight
                    ? `${onboardingPayload.physicalStats.targetWeight} kg`
                    : '--',
                accentColor: '#10B981',
            },
        ],
        [onboardingPayload.physicalStats],
    );

    return (
        <View style={globalStyles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={profileScreenStyles.scrollContent}
            >
                <ProfileSummaryCard
                    name={profileName}
                    email={profileEmail}
                    subtitle={profileSubtitle}
                    initials={getInitials(profileName)}
                />

                <View style={profileScreenStyles.sectionCard}>
                    <Text style={profileScreenStyles.sectionTitle}>Training Profile</Text>

                    <ProfileDetailRow
                        label="Goal"
                        value={formatValue(onboardingPayload.goal)}
                    />
                    <ProfileDetailRow
                        label="Fitness Level"
                        value={formatValue(onboardingPayload.fitnessLevel)}
                    />
                    <ProfileDetailRow
                        label="Training Location"
                        value={formatValue(onboardingPayload.trainingLocation)}
                    />
                    <ProfileDetailRow
                        label="Workout Frequency"
                        value={
                            onboardingPayload.workoutDays
                                ? `${onboardingPayload.workoutDays} days / week`
                                : 'Not set yet'
                        }
                    />
                </View>

                <View style={profileScreenStyles.sectionCard}>
                    <Text style={profileScreenStyles.sectionTitle}>Focus Muscles</Text>

                    <View style={profileScreenStyles.chipWrapper}>
                        {focusMuscles.map((muscle) => (
                            <View key={muscle} style={profileScreenStyles.chip}>
                                <Text style={profileScreenStyles.chipText}>
                                    {formatValue(muscle)}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={profileScreenStyles.sectionCard}>
                    <Text style={profileScreenStyles.sectionTitle}>Physical Stats</Text>

                    <View style={profileScreenStyles.statsGrid}>
                        {stats.map((stat) => (
                            <ProfileStatCard
                                key={stat.label}
                                label={stat.label}
                                value={stat.value}
                                accentColor={stat.accentColor}
                            />
                        ))}
                    </View>
                </View>

                <Pressable
                    onPress={logout}
                    style={profileScreenStyles.logoutButton}
                >
                    <Text style={profileScreenStyles.logoutButtonText}>Log Out</Text>
                </Pressable>
            </ScrollView>
        </View>
    );
};

export default ProfileScreenPage;
