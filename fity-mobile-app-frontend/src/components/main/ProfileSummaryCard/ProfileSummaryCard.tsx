import React from 'react';
import { Text, View } from 'react-native';
import { profileSummaryCardStyles } from '@/components/main/ProfileSummaryCard/ProfileSummaryCard.styles';
import { TProfileSummaryCardProps } from '@/components/main/ProfileSummaryCard/ProfileSummaryCard.type';

const ProfileSummaryCard = ({
    name,
    email,
    subtitle,
    initials,
}: TProfileSummaryCardProps) => {
    return (
        <View style={profileSummaryCardStyles.card}>
            <View style={profileSummaryCardStyles.topRow}>
                <View style={profileSummaryCardStyles.avatar}>
                    <Text style={profileSummaryCardStyles.initials}>{initials}</Text>
                </View>

                <View style={profileSummaryCardStyles.content}>
                    <Text style={profileSummaryCardStyles.name}>{name}</Text>
                    <Text style={profileSummaryCardStyles.email}>{email}</Text>

                    <View style={profileSummaryCardStyles.subtitleBadge}>
                        <Text style={profileSummaryCardStyles.subtitle}>{subtitle}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default ProfileSummaryCard;
