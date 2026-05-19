import React from 'react';
import { Text, View } from 'react-native';
import { profileDetailRowStyles } from '@/components/main/ProfileDetailRow/ProfileDetailRow.styles';
import { TProfileDetailRowProps } from '@/components/main/ProfileDetailRow/ProfileDetailRow.type';

const ProfileDetailRow = ({
    label,
    value,
}: TProfileDetailRowProps) => {
    return (
        <View style={[profileDetailRowStyles.row, profileDetailRowStyles.borderedRow]}>
            <Text style={profileDetailRowStyles.label}>{label}</Text>
            <Text style={profileDetailRowStyles.value}>{value}</Text>
        </View>
    );
};

export default ProfileDetailRow;
