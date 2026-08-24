import { axiosInstance } from '@/services/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/api/endpoints';

export class HydrationService {
    static async getTodayHydration(): Promise<any> {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.hydration.today);
            return response.data?.data || { totalMl: 0, dailyGoalMl: 2500, logs: [] };
        } catch (error) {
            console.error('getTodayHydration error:', error);
            return { totalMl: 0, dailyGoalMl: 2500, logs: [] };
        }
    }

    static async addLog(data: { amountMl: number; date?: string }): Promise<any> {
        const response = await axiosInstance.post(
            API_ENDPOINTS.hydration.hydrationLogs,
            data
        );
        return response.data?.data;
    }
}