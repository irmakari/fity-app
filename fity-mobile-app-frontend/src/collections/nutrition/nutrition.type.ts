export type TFood = {
    id: string;
    name: string;
    caloriesPerServing: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
    servingUnit: string;
    servingSize: number;
    createdAt: string;
};

export type TNutritionGoal = {
    id: string;
    userId: string;
    calorieGoal: number;
    proteinGoalG: number;
    carbsGoalG: number;
    fatGoalG: number;
    updatedAt: string;
};

export type TNutritionMeal = {
    id: string;
    userId: string;
    mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
    calories: number;
    foods: string[];
};

export type TNutritionMacros = {
    proteinG: number;
    carbsG: number;
    fatG: number;
};
