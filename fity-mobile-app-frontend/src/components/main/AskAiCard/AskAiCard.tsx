import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/theme/colors';
import {TAskAiCardProps} from "@/components/main/AskAiCard/AskAiCard.type";
import {askAiCardStyles} from "@/components/main/AskAiCard/AskAiCard.styles";

export default function AskAiCard({
                                      title,
                                      description,
                                      onPress,
                                  }: TAskAiCardProps) {
    return (
        <TouchableOpacity
            style={askAiCardStyles.container}
            activeOpacity={0.85}
            onPress={onPress}
        >
            <View style={askAiCardStyles.iconWrapper}>
                <Ionicons name="sparkles-outline" size={30} color={colors.textPrimary} />
            </View>

            <View style={askAiCardStyles.content}>
                <Text style={askAiCardStyles.title}>{title}</Text>
                <Text style={askAiCardStyles.description}>{description}</Text>
            </View>
        </TouchableOpacity>
    );
}