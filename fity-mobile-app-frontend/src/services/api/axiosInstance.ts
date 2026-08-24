import axios from 'axios';

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
    authToken = token;
};

const getBaseURL = () => {
    if (process.env.EXPO_PUBLIC_API_BASE_URL) {
        return process.env.EXPO_PUBLIC_API_BASE_URL;
    }
    return 'http://localhost:5555/api';
};

export const axiosInstance = axios.create({
    baseURL: getBaseURL(),
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use((config) => {
    if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
});