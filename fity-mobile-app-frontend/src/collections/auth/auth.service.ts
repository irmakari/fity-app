import { axiosInstance, setAuthToken } from '@/services/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/api/endpoints';
import { LoginRequestParams, User } from './auth.type';

export interface RegisterRequestParams {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    message?: string;
    data: {
        user: {
            id: string;
            name: string;
            email: string;
        };
        token: string;
    };
}

export const postRegister = async (
    params: RegisterRequestParams
): Promise<AuthResponse['data']> => {
    const response = await axiosInstance.post<AuthResponse>(
        API_ENDPOINTS.auth.register,
        params
    );

    if (response.data?.data?.token) {
        setAuthToken(response.data.data.token);
    }

    return response.data.data;
};

export const postLogin = async (
    params: LoginRequestParams
): Promise<AuthResponse['data']> => {
    const response = await axiosInstance.post<AuthResponse>(
        API_ENDPOINTS.auth.login,
        params
    );

    if (response.data?.data?.token) {
        setAuthToken(response.data.data.token);
    }

    return response.data.data;
};