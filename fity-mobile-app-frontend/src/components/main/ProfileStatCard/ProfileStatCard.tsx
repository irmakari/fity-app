import React from 'react';
import { Text, View } from 'react-native';
import { colors } from '@/theme';
import { profileStatCardStyles } from '@/components/main/ProfileStatCard/ProfileStatCard.styles';
import { TProfileStatCardProps } from '@/components/main/ProfileStatCard/ProfileStatCard.type';

const ProfileStatCard = ({
    label,
    value,
    accentColor = colors.primaryButton,
}: TProfileStatCardProps) => {
    return (
        <View style={profileStatCardStyles.card}>
            <View
                style={[
                    profileStatCardStyles.topAccent,
                    { backgroundColor: accentColor },
                ]}
            />

            <Text style={profileStatCardStyles.value}>{value}</Text>
            <Text style={profileStatCardStyles.label}>{label}</Text>
        </View>
    );
};

export default ProfileStatCard;
