import React, { useState, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    FlatList,
    TextInput,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { colors, typography } from '@/theme';
import { MainStackParamList } from '@/navigation/MainNavigator';
import { NutritionService } from '@/collections/nutrition/nutrition.service';
import { TFood } from '@/collections/nutrition/nutrition.type';

type AddFoodRouteProp = RouteProp<MainStackParamList, 'NutritionAddFood'>;

const AddFoodScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<AddFoodRouteProp>();
    const { mealType } = route.params;

    const [loading, setLoading] = useState(true);
    const [foods, setFoods] = useState<TFood[]>([]);
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState<Set<string>>(new Set());

    useEffect(() => {
        NutritionService.getFoods()
            .then(setFoods)
            .catch(() => console.error('Failed to load foods'))
            .finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(
        () =>
            query.trim()
                ? foods.filter(f => f.name.toLowerCase().includes(query.trim().toLowerCase()))
                : foods,
        [foods, query]
    );

    const toggleSelect = (id: string) => {
        setSelected(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const handleAdd = () => {
        if (selected.size === 0) {
            Alert.alert('No selection', 'Please select at least one food item.');
            return;
        }
        // API call would go here to add selected foods to the meal
        // await NutritionService.addFoodsToMeal({ mealType, foodIds: [...selected] });
        Alert.alert(
            'Added!',
            `${selected.size} food item${selected.size > 1 ? 's' : ''} added to ${mealType}.`,
            [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
    };

    const renderFood = ({ item }: { item: TFood }) => {
        const isSelected = selected.has(item.id);
        return (
            <TouchableOpacity
                style={[styles.foodItem, isSelected && styles.foodItemSelected]}
                onPress={() => toggleSelect(item.id)}
                activeOpacity={0.75}
            >
                <View style={styles.foodInfo}>
                    <Text style={styles.foodName}>{item.name}</Text>
                    <Text style={styles.foodMeta}>
                        {item.caloriesPerServing} kcal · {item.servingSize} {item.servingUnit}
                    </Text>
                    <View style={styles.macroRow}>
                        <Text style={styles.macroChip}>P {item.proteinG}g</Text>
                        <Text style={styles.macroChip}>C {item.carbsG}g</Text>
                        <Text style={styles.macroChip}>F {item.fatG}g</Text>
                    </View>
                </View>
                <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                    {isSelected && <Ionicons name="checkmark" size={16} color={colors.surface} />}
                </View>
            </TouchableOpacity>
        );
    };

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
                        <Text style={styles.headerTitle}>Add Food</Text>
                        <Text style={styles.headerSubtitle}>{mealType}</Text>
                    </View>
                    <View style={{ width: 40 }} />
                </View>

                <View style={styles.searchBar}>
                    <Ionicons name="search-outline" size={20} color={colors.textMuted} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search foods..."
                        placeholderTextColor={colors.inputPlaceholder}
                        value={query}
                        onChangeText={setQuery}
                        autoCorrect={false}
                    />
                    {query.length > 0 && (
                        <TouchableOpacity onPress={() => setQuery('')}>
                            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
                        </TouchableOpacity>
                    )}
                </View>

                {loading ? (
                    <View style={styles.centered}>
                        <ActivityIndicator size="large" color={colors.primaryButton} />
                    </View>
                ) : (
                    <FlatList
                        data={filtered}
                        keyExtractor={item => item.id}
                        renderItem={renderFood}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>No foods found.</Text>
                        }
                    />
                )}

                {selected.size > 0 && (
                    <TouchableOpacity style={styles.addButton} onPress={handleAdd} activeOpacity={0.85}>
                        <Ionicons name="add-circle-outline" size={20} color={colors.surface} />
                        <Text style={styles.addButtonText}>
                            Add {selected.size} item{selected.size > 1 ? 's' : ''} to {mealType}
                        </Text>
                    </TouchableOpacity>
                )}
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
        paddingBottom: 18,
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
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 14,
        marginBottom: 16,
        gap: 10,
        borderWidth: 1,
        borderColor: colors.borderSoft,
        shadowColor: colors.shadow,
        shadowOpacity: 0.05,
        shadowRadius: 12,
        shadowOffset: {
            width: 0,
            height: 6,
        },
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        ...typography.input,
        fontSize: 15,
        color: colors.textPrimary,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        gap: 10,
        paddingBottom: 100,
    },
    foodItem: {
        backgroundColor: colors.surface,
        borderRadius: 22,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: colors.borderSoft,
        shadowColor: colors.shadow,
        shadowOpacity: 0.05,
        shadowRadius: 12,
        shadowOffset: {
            width: 0,
            height: 6,
        },
        elevation: 2,
    },
    foodItemSelected: {
        borderWidth: 1.5,
        borderColor: '#EF4444',
        backgroundColor: '#FFF3F2',
    },
    foodInfo: {
        flex: 1,
        gap: 5,
    },
    foodName: {
        ...typography.label,
        fontSize: 15,
        color: colors.textPrimary,
    },
    foodMeta: {
        ...typography.helperText,
        fontSize: 13,
        color: colors.textSecondary,
    },
    macroRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 4,
    },
    macroChip: {
        ...typography.helperText,
        fontSize: 12,
        color: colors.textSecondary,
        backgroundColor: colors.surfaceTint,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    checkbox: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: colors.borderSoft,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 12,
        backgroundColor: colors.surface,
    },
    checkboxSelected: {
        backgroundColor: '#EF4444',
        borderColor: '#EF4444',
    },
    emptyText: {
        textAlign: 'center',
        ...typography.input,
        color: colors.textMuted,
        paddingVertical: 32,
    },
    addButton: {
        position: 'absolute',
        bottom: 24,
        left: 16,
        right: 16,
        backgroundColor: '#EF4444',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 18,
        gap: 8,
        elevation: 4,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.16,
        shadowRadius: 16,
    },
    addButtonText: {
        ...typography.button,
        color: colors.surface,
    },
});

export default AddFoodScreen;
