import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/theme/colors';
import {planProgressCardStyles} from "@/components/main/PlanProgressCard/PlanProgressCard.styles";
import {TPlanProgressCardProps} from "@/components/main/PlanProgressCard/PlanProgressCard.type";

export default function PlanProgressCard({
                                             title,
                                             value,
                                             subtitle,
                                             insight,
                                             actionLabel = 'Open tracker',
                                             progress,
                                             accentColor,
                                             iconName,
                                             onPress,
                                         }: TPlanProgressCardProps) {
    const safeProgress = Math.max(0, Math.min(progress, 1));

    return (
        <TouchableOpacity
            style={planProgressCardStyles.card}
            activeOpacity={0.85}
            onPress={onPress}
        >
            <View style={planProgressCardStyles.leftSection}>
                <View
                    style={[
                        planProgressCardStyles.iconWrapper,
                        { backgroundColor: `${accentColor}15` },
                    ]}
                >
                    <Ionicons name={iconName} size={26} color={accentColor} />
                </View>

                <View style={planProgressCardStyles.content}>
                    <Text style={planProgressCardStyles.title}>{title}</Text>
                    <Text style={planProgressCardStyles.value}>{value}</Text>

                    {!!subtitle && (
                        <Text style={planProgressCardStyles.subtitle}>{subtitle}</Text>
                    )}

                    <View style={planProgressCardStyles.progressTrack}>
                        <View
                            style={[
                                planProgressCardStyles.progressFill,
                                {
                                    width: `${safeProgress * 100}%`,
                                    backgroundColor: accentColor,
                                },
                            ]}
                        />
                    </View>

                    <View style={planProgressCardStyles.footerRow}>
                        <Text style={planProgressCardStyles.insightText}>
                            {insight || 'Daily progress is ready to review'}
                        </Text>

                        <View
                            style={[
                                planProgressCardStyles.actionBadge,
                                { backgroundColor: `${accentColor}12` },
                            ]}
                        >
                            <Text
                                style={[
                                    planProgressCardStyles.actionText,
                                    { color: accentColor },
                                ]}
                            >
                                {actionLabel}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={planProgressCardStyles.arrowButton}>
                <Ionicons
                    name="chevron-forward"
                    size={24}
                    color={colors.textMuted}
                />
            </View>
        </TouchableOpacity>
    );
}
