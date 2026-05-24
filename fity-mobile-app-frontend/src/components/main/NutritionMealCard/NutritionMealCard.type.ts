export type TNutritionMealCardProps = {
    mealType: string;
    calories: number;
    foods: string[];
    accentColor?: string;
    onAddPress: () => void;
};
