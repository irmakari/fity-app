import { axiosInstance } from '@/services/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/api/endpoints';
import { LoginRequestParams, User } from './auth.type';

export const postLogin = async (
    params: LoginRequestParams
): Promise<User[]> => {
    const response = await axiosInstance.get<User[]>(
        API_ENDPOINTS.auth.login
    );

    return response.data;
};