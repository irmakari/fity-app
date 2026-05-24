import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { colors, typography } from '@/theme';
import { MainStackParamList } from '@/navigation/MainNavigator';
import { NutritionService } from '@/collections/nutrition/nutrition.service';
import { TNutritionGoal, TNutritionMeal, TFood } from '@/collections/nutrition/nutrition.type';
import { NutritionMealCard } from '@/components/main/NutritionMealCard';
import { MacroProgressBar } from '@/components/main/MacroProgressBar';
import { useAuth } from '@/context/AuthContext';

const NUTRITION_COLOR = '#EF4444';

const NutritionScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
    const { user } = useAuth();
    const userId = user?.id ?? '1';

    const [loading, setLoading] = useState(true);
    const [goal, setGoal] = useState<TNutritionGoal | null>(null);
    const [meals, setMeals] = useState<TNutritionMeal[]>([]);
    const [foods, setFoods] = useState<TFood[]>([]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [goalData, mealsData, foodsData] = await Promise.all([
                NutritionService.getGoal(userId),
                NutritionService.getMeals(userId),
                NutritionService.getFoods(),
            ]);
            setGoal(goalData);
            setMeals(mealsData);
            setFoods(foodsData);
        } catch (error) {
            console.error('Error fetching nutrition data:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(useCallback(() => { fetchData(); }, []));

    const calorieGoal = goal?.calorieGoal ?? 2000;
    const totalCalories = meals.reduce((acc, m) => acc + m.calories, 0);
    const calorieProgress = Math.min(totalCalories / calorieGoal, 1);
    const caloriePercent = Math.round(calorieProgress * 100);

    const macros = NutritionService.computeMacros(meals, foods);

    if (loading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color={colors.primaryButton} />
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            <Text style={styles.pageTitle}>Nutrition</Text>

            {/* Calorie Summary Card */}
            <View style={styles.card}>
                <View style={styles.calorieSummaryRow}>
                    <View style={styles.calorieStat}>
                        <Text style={styles.calorieNumber}>{totalCalories}</Text>
                        <Text style={styles.calorieStatLabel}>consumed</Text>
                    </View>
                    <View style={styles.calorieDivider} />
                    <View style={styles.calorieStat}>
                        <Text style={[styles.calorieNumber, { color: colors.success }]}>
                            {Math.max(calorieGoal - totalCalories, 0)}
                        </Text>
                        <Text style={styles.calorieStatLabel}>remaining</Text>
                    </View>
                    <View style={styles.calorieDivider} />
                    <View style={styles.calorieStat}>
                        <Text style={styles.calorieNumber}>{calorieGoal}</Text>
                        <Text style={styles.calorieStatLabel}>goal</Text>
                    </View>
                </View>

                <View style={styles.progressTrack}>
                    <View
                        style={[
                            styles.progressFill,
                            { width: `${calorieProgress * 100}%` },
                        ]}
                    />
                </View>
                <Text style={styles.progressLabel}>{caloriePercent}% of daily goal</Text>
            </View>

            {/* Macros Card */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Macros</Text>
                <View style={styles.macrosList}>
                    <MacroProgressBar
                        label="Protein"
                        current={macros.proteinG}
                        goal={goal?.proteinGoalG ?? 120}
                        color="#3B82F6"
                    />
                    <MacroProgressBar
                        label="Carbs"
                        current={macros.carbsG}
                        goal={goal?.carbsGoalG ?? 250}
                        color="#F59E0B"
                    />
                    <MacroProgressBar
                        label="Fat"
                        current={macros.fatG}
                        goal={goal?.fatGoalG ?? 70}
                        color={NUTRITION_COLOR}
                    />
                </View>
            </View>

            {/* Meals Section */}
            <View style={styles.mealsSection}>
                <View style={styles.mealsHeader}>
                    <Text style={styles.sectionTitle}>Today's Meals</Text>
                    <TouchableOpacity
                        style={styles.addMealButton}
                        onPress={() => navigation.navigate('NutritionMealSelection')}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="add" size={18} color={colors.surface} />
                        <Text style={styles.addMealButtonText}>Add Meal</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.mealsList}>
                    {meals.map(meal => (
                        <NutritionMealCard
                            key={meal.id}
                            mealType={meal.mealType}
                            calories={meal.calories}
                            foods={meal.foods}
                            accentColor={NUTRITION_COLOR}
                            onAddPress={() =>
                                navigation.navigate('NutritionAddFood', { mealType: meal.mealType })
                            }
                        />
                    ))}

                    {meals.length === 0 && (
                        <Text style={styles.emptyText}>No meals logged today yet.</Text>
                    )}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        paddingHorizontal: 16,
        paddingTop: 64,
        paddingBottom: 32,
        gap: 16,
    },
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    pageTitle: {
        ...typography.title,
        fontSize: 28,
        lineHeight: 36,
        color: colors.textPrimary,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: 24,
        padding: 20,
        gap: 14,
        borderWidth: 1,
        borderColor: colors.borderSoft,
        shadowColor: colors.shadow,
        shadowOpacity: 0.06,
        shadowRadius: 14,
        shadowOffset: {
            width: 0,
            height: 6,
        },
        elevation: 3,
    },
    calorieSummaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    calorieStat: {
        flex: 1,
        alignItems: 'center',
    },
    calorieNumber: {
        ...typography.title,
        fontSize: 22,
        lineHeight: 30,
        color: colors.textPrimary,
    },
    calorieStatLabel: {
        ...typography.helperText,
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 4,
    },
    calorieDivider: {
        width: 1,
        height: 36,
        backgroundColor: '#E6ECF2',
    },
    progressTrack: {
        height: 10,
        borderRadius: 999,
        backgroundColor: '#E7EDF3',
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 999,
        backgroundColor: NUTRITION_COLOR,
    },
    progressLabel: {
        ...typography.helperText,
        fontSize: 13,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    sectionTitle: {
        ...typography.label,
        fontSize: 16,
        color: colors.textPrimary,
    },
    macrosList: {
        gap: 14,
    },
    mealsSection: {
        gap: 12,
    },
    mealsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    addMealButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: NUTRITION_COLOR,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 18,
        gap: 6,
        shadowColor: colors.shadow,
        shadowOpacity: 0.12,
        shadowRadius: 12,
        shadowOffset: {
            width: 0,
            height: 8,
        },
        elevation: 4,
    },
    addMealButtonText: {
        ...typography.button,
        fontSize: 13,
        color: colors.surface,
    },
    mealsList: {
        gap: 12,
    },
    emptyText: {
        ...typography.input,
        color: colors.textMuted,
        textAlign: 'center',
        paddingVertical: 24,
    },
});

export default NutritionScreen;
