import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
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

const TodayNutritionDetailScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
    const { user } = useAuth();
    const userId = user?.id ?? '1';

    const [loading, setLoading] = useState(true);
    const [goal, setGoal] = useState<TNutritionGoal | null>(null);
    const [meals, setMeals] = useState<TNutritionMeal[]>([]);
    const [foods, setFoods] = useState<TFood[]>([]);

    useEffect(() => {
        Promise.all([
            NutritionService.getGoal(userId),
            NutritionService.getMeals(userId),
            NutritionService.getFoods(),
        ])
            .then(([goalData, mealsData, foodsData]) => {
                setGoal(goalData);
                setMeals(mealsData);
                setFoods(foodsData);
            })
            .catch((err) => console.error('Error loading nutrition detail:', err))
            .finally(() => setLoading(false));
    }, []);

    const calorieGoal = goal?.calorieGoal ?? 2000;
    const totalCalories = meals.reduce((acc, m) => acc + m.calories, 0);
    const calorieProgress = Math.min(totalCalories / calorieGoal, 1);
    const macros = NutritionService.computeMacros(meals, foods);
    const totalFoodsLogged = meals.reduce((acc, meal) => acc + meal.foods.length, 0);
    const averageCaloriesPerMeal = meals.length ? Math.round(totalCalories / meals.length) : 0;

    if (loading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color={colors.primaryButton} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="chevron-back" size={28} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Today's Nutrition</Text>
                    <View style={{ width: 40 }} />
                </View>

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
                            style={[styles.progressFill, { width: `${calorieProgress * 100}%` }]}
                        />
                    </View>
                    <Text style={styles.progressLabel}>
                        {Math.round(calorieProgress * 100)}% of daily goal
                    </Text>
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

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Daily Tracking</Text>

                    <View style={styles.trackingGrid}>
                        <View style={styles.trackingCard}>
                            <Text style={styles.trackingValue}>{meals.length}</Text>
                            <Text style={styles.trackingLabel}>Meals logged</Text>
                        </View>
                        <View style={styles.trackingCard}>
                            <Text style={styles.trackingValue}>{totalFoodsLogged}</Text>
                            <Text style={styles.trackingLabel}>Foods added</Text>
                        </View>
                        <View style={styles.trackingCard}>
                            <Text style={styles.trackingValue}>{averageCaloriesPerMeal}</Text>
                            <Text style={styles.trackingLabel}>Avg kcal / meal</Text>
                        </View>
                    </View>
                </View>

                {/* Meals Section */}
                <Text style={styles.sectionTitle}>Today's Meals</Text>
                <View style={styles.mealsList}>
                    {meals.map((meal) => (
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
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    centered: { justifyContent: 'center', alignItems: 'center' },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 64,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 24,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.borderSoft,
    },
    headerTitle: {
        ...typography.title,
        fontSize: 22,
        lineHeight: 30,
        color: colors.textPrimary,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
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
        fontSize: 17,
        color: colors.textPrimary,
        marginBottom: 12,
    },
    macrosList: {
        gap: 14,
    },
    trackingGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    trackingCard: {
        flex: 1,
        backgroundColor: colors.surfaceMuted,
        borderRadius: 18,
        paddingVertical: 16,
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    trackingValue: {
        ...typography.title,
        fontSize: 20,
        lineHeight: 28,
        color: colors.textPrimary,
        marginBottom: 4,
    },
    trackingLabel: {
        ...typography.helperText,
        fontSize: 11,
        color: colors.textSecondary,
        textAlign: 'center',
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

export default TodayNutritionDetailScreen;
