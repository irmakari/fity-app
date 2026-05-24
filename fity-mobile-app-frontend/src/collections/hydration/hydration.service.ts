import { axiosInstance } from '@/services/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/api/endpoints';
import {
    THydrationGoalResponse,
    THydrationLogBody,
    THydrationLogResponse,
} from './hydration.type';

export class HydrationService {
    static goalsPath = API_ENDPOINTS.hydration.hydrationGoals;
    static logsPath = API_ENDPOINTS.hydration.hydrationLogs;

    static async getGoal(userId: number): Promise<THydrationGoalResponse | null> {
        const response = await axiosInstance.get<THydrationGoalResponse[]>(
            `${this.goalsPath}?userId=${userId}`
        );

        return response.data[0] ?? null;
    }

    static async getLogs(userId: number): Promise<THydrationLogResponse[]> {
        const response = await axiosInstance.get<THydrationLogResponse[]>(
            `${this.logsPath}?userId=${userId}`
        );

        return response.data;
    }

    static async addLog(data: THydrationLogBody): Promise<THydrationLogResponse> {
        const response = await axiosInstance.post<THydrationLogResponse>(
            this.logsPath,
            data
        );

        return response.data;
    }
}