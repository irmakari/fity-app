import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { nutritionMealCardStyles } from './NutritionMealCard.styles';
import { TNutritionMealCardProps } from './NutritionMealCard.type';

export default function NutritionMealCard({
    mealType,
    calories,
    foods,
    accentColor = '#EF4444',
    onAddPress,
}: TNutritionMealCardProps) {
    return (
        <View style={nutritionMealCardStyles.card}>
            <View style={nutritionMealCardStyles.header}>
                <View>
                    <Text style={nutritionMealCardStyles.mealType}>{mealType}</Text>
                    <Text style={nutritionMealCardStyles.caloriesText}>{calories} kcal</Text>
                </View>
                <TouchableOpacity
                    style={[nutritionMealCardStyles.addButton, { backgroundColor: `${accentColor}18` }]}
                    onPress={onAddPress}
                    activeOpacity={0.75}
                >
                    <Ionicons name="add" size={20} color={accentColor} />
                </TouchableOpacity>
            </View>

            {foods.length > 0 ? (
                <View style={nutritionMealCardStyles.foodsContainer}>
                    {foods.map((food, i) => (
                        <View key={i} style={nutritionMealCardStyles.foodChip}>
                            <Text style={nutritionMealCardStyles.foodChipText}>{food}</Text>
                        </View>
                    ))}
                </View>
            ) : (
                <Text style={nutritionMealCardStyles.emptyText}>No foods added yet</Text>
            )}
        </View>
    );
}
