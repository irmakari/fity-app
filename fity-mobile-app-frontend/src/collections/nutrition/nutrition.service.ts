import { axiosInstance } from '@/services/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/api/endpoints';
import { TFood, TNutritionGoal, TNutritionMeal, TNutritionMacros } from './nutrition.type';

export class NutritionService {
    static async getFoods(): Promise<TFood[]> {
        const response = await axiosInstance.get<TFood[]>(API_ENDPOINTS.nutrition.foods);
        return response.data;
    }

    static async getGoal(userId: string): Promise<TNutritionGoal | null> {
        const response = await axiosInstance.get<TNutritionGoal[]>(
            `${API_ENDPOINTS.nutrition.nutritionGoals}?userId=${userId}`
        );
        return response.data[0] ?? null;
    }

    static async getMeals(userId: string): Promise<TNutritionMeal[]> {
        const response = await axiosInstance.get<TNutritionMeal[]>(
            `${API_ENDPOINTS.nutrition.nutritionMeals}?userId=${userId}`
        );
        return response.data;
    }

    static computeMacros(meals: TNutritionMeal[], foods: TFood[]): TNutritionMacros {
        let proteinG = 0;
        let carbsG = 0;
        let fatG = 0;

        meals.forEach(meal => {
            meal.foods.forEach(foodName => {
                const food = foods.find(f => f.name.toLowerCase() === foodName.toLowerCase());
                if (food) {
                    proteinG += food.proteinG;
                    carbsG += food.carbsG;
                    fatG += food.fatG;
                }
            });
        });

        return { proteinG, carbsG, fatG };
    }
}
