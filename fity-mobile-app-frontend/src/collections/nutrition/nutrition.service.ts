import { axiosInstance } from '@/services/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/api/endpoints';

export class NutritionService {
    static async getFoods(): Promise<any[]> {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.nutrition.foods);
            return response.data?.data?.foods || response.data?.data || [];
        } catch (error) {
            console.error('getFoods error:', error);
            return [];
        }
    }

    static async getDailySummary(date?: string): Promise<any> {
        try {
            const dateParam = date ? `?date=${date}` : '';
            const response = await axiosInstance.get(`${API_ENDPOINTS.nutrition.summary}${dateParam}`);
            return response.data?.data || null;
        } catch (error) {
            console.error('getDailySummary error:', error);
            return null;
        }
    }
}
