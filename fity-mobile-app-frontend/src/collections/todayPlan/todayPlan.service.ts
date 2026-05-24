import { axiosInstance } from '@/services/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/api/endpoints';
import { TTodayPlan } from './todayPlan.type';

export class TodayPlanService {
    static async getTodayPlan(userId: number): Promise<TTodayPlan | null> {
        const response = await axiosInstance.get<TTodayPlan[]>(
            `${API_ENDPOINTS.todayPlan}?userId=${userId}`
        );
        return response.data[0] ?? null;
    }
}
