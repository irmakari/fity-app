import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/theme/colors';
import {homeGreetingHeaderStyles} from "@/components/main/HomeGreetingHeader/HomeGreetingHeader.styles";
import {THomeGreetingHeaderProps} from "@/components/main/HomeGreetingHeader/HomeGreetingHeader.type";

export default function HomeGreetingHeader({
                                               userName,
                                               onProfilePress,
                                               onLogoutPress,
                                           }: THomeGreetingHeaderProps) {
    const initials = userName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((namePart) => namePart.charAt(0).toUpperCase())
        .join('');

    return (
        <View style={homeGreetingHeaderStyles.container}>
            <TouchableOpacity
                style={homeGreetingHeaderStyles.leftSection}
                onPress={onProfilePress}
                activeOpacity={0.85}
            >
                <View style={homeGreetingHeaderStyles.avatarWrapper}>
                    <Text style={homeGreetingHeaderStyles.avatarText}>
                        {initials || 'FT'}
                    </Text>
                </View>

                <View style={homeGreetingHeaderStyles.textWrapper}>
                    <View style={homeGreetingHeaderStyles.greetingBadge}>
                        <Text style={homeGreetingHeaderStyles.greetingText}>Today&apos;s overview</Text>
                    </View>
                    <Text style={homeGreetingHeaderStyles.nameText}>Hi, {userName}</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                style={homeGreetingHeaderStyles.logoutButton}
                onPress={onLogoutPress}
                activeOpacity={0.85}
            >
                <Ionicons name="log-out-outline" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
        </View>
    );
}
