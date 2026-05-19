import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme';
import { selectableCardStyles } from '@/components/onboarding/SelectableCard/SelectableCard.styles';
import { TSelectableCardProps } from '@/components/onboarding/SelectableCard/SelectableCard.type';

const SelectableCard = ({
    title,
    description,
    iconName,
    selected,
    onPress,
    compact = false,
}: TSelectableCardProps) => {
    return (
        <Pressable
            onPress={onPress}
            style={[
                selectableCardStyles.card,
                compact && selectableCardStyles.compactCard,
                selected && selectableCardStyles.selectedCard,
            ]}
        >
            {!!iconName && (
                <View
                    style={[
                        selectableCardStyles.iconWrapper,
                        selected && selectableCardStyles.selectedIconWrapper,
                    ]}
                >
                    <Ionicons
                        name={iconName}
                        size={22}
                        color={selected ? colors.primaryButton : colors.textSecondary}
                    />
                </View>
            )}

            <View style={selectableCardStyles.content}>
                <Text style={selectableCardStyles.title}>{title}</Text>

                {!!description && (
                    <Text style={selectableCardStyles.description}>{description}</Text>
                )}
            </View>
        </Pressable>
    );
};

export default SelectableCard;
