import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme';
import { multiSelectCardStyles } from '@/components/onboarding/MultiSelectCard/MultiSelectCard.styles';
import { TMultiSelectCardProps } from '@/components/onboarding/MultiSelectCard/MultiSelectCard.type';

const MultiSelectCard = ({
    title,
    iconName,
    selected,
    onPress,
}: TMultiSelectCardProps) => {
    return (
        <Pressable
            onPress={onPress}
            style={[
                multiSelectCardStyles.card,
                selected && multiSelectCardStyles.selectedCard,
            ]}
        >
            <View style={multiSelectCardStyles.leftContent}>
                {!!iconName && (
                    <View
                        style={[
                            multiSelectCardStyles.iconWrapper,
                            selected && multiSelectCardStyles.selectedIconWrapper,
                        ]}
                    >
                        <Ionicons
                            name={iconName}
                            size={20}
                            color={selected ? colors.primaryButton : colors.textSecondary}
                        />
                    </View>
                )}

                <Text style={multiSelectCardStyles.title}>{title}</Text>
            </View>

            <View
                style={[
                    multiSelectCardStyles.checkbox,
                    selected && multiSelectCardStyles.selectedCheckbox,
                ]}
            >
                {selected && <Ionicons name="checkmark" size={14} color={colors.surface} />}
            </View>
        </Pressable>
    );
};

export default MultiSelectCard;
