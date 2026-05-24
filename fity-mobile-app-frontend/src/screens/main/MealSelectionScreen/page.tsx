import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { colors, typography } from '@/theme';
import { MainStackParamList } from '@/navigation/MainNavigator';

type TMealOption = {
    mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
    iconName: keyof typeof Ionicons.glyphMap;
    color: string;
    description: string;
};

const MEAL_OPTIONS: TMealOption[] = [
    {
        mealType: 'Breakfast',
        iconName: 'sunny-outline',
        color: '#F59E0B',
        description: 'Morning fuel',
    },
    {
        mealType: 'Lunch',
        iconName: 'restaurant-outline',
        color: '#10B981',
        description: 'Midday meal',
    },
    {
        mealType: 'Dinner',
        iconName: 'moon-outline',
        color: '#6366F1',
        description: 'Evening meal',
    },
    {
        mealType: 'Snack',
        iconName: 'nutrition-outline',
        color: '#EF4444',
        description: 'Between meals',
    },
];

const MealSelectionScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="chevron-back" size={28} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <Text style={styles.headerTitle}>Add Meal</Text>
                        <Text style={styles.headerSubtitle}>Select a meal type</Text>
                    </View>
                    <View style={{ width: 40 }} />
                </View>

                <View style={styles.grid}>
                    {MEAL_OPTIONS.map(option => (
                        <TouchableOpacity
                            key={option.mealType}
                            style={styles.mealCard}
                            onPress={() =>
                                navigation.navigate('NutritionAddFood', { mealType: option.mealType })
                            }
                            activeOpacity={0.8}
                        >
                            <View
                                style={[
                                    styles.iconWrapper,
                                    { backgroundColor: `${option.color}18` },
                                ]}
                            >
                                <Ionicons name={option.iconName} size={32} color={option.color} />
                            </View>
                            <Text style={styles.mealTypeLabel}>{option.mealType}</Text>
                            <Text style={styles.mealTypeDesc}>{option.description}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 64,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 28,
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
    headerCenter: {
        alignItems: 'center',
    },
    headerTitle: {
        ...typography.title,
        fontSize: 22,
        lineHeight: 30,
        color: colors.textPrimary,
    },
    headerSubtitle: {
        ...typography.input,
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 2,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 14,
    },
    mealCard: {
        width: '47%',
        backgroundColor: colors.surface,
        borderRadius: 26,
        paddingVertical: 28,
        paddingHorizontal: 16,
        alignItems: 'center',
        gap: 10,
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
    iconWrapper: {
        width: 72,
        height: 72,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    mealTypeLabel: {
        ...typography.label,
        fontSize: 16,
        color: colors.textPrimary,
    },
    mealTypeDesc: {
        ...typography.helperText,
        fontSize: 13,
        color: colors.textSecondary,
        textAlign: 'center',
    },
});

export default MealSelectionScreen;
