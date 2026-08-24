import { axiosInstance } from '@/services/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/api/endpoints';

export class TodayPlanService {
    static async getTodayPlan(): Promise<any | null> {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.todayPlan);
            const plans = response.data?.data?.plans || [];
            return plans[0] ?? null;
        } catch (error) {
            console.error('getTodayPlan error:', error);
            return null;
        }
    }
}
