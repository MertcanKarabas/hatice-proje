import axios from 'axios';
import type { IHttpClient } from './httpClient';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000', // Backend adresi
});

// Her request öncesi token varsa header'a ekle
axiosInstance.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const axiosClient: IHttpClient = {
    get: async <T>(url: string, config?: Record<string, unknown>) => {
        const response = await axiosInstance.get<T>(url, config);
        return response.data;
    },
    post: async <T>(url: string, data?: unknown, config?: Record<string, unknown>) => {
        const response = await axiosInstance.post<T>(url, data, config);
        return response.data;
    },
    put: async <T>(url: string, data?: unknown, config?: Record<string, unknown>) => {
        const response = await axiosInstance.put<T>(url, data, config);
        return response.data;
    },
    delete: async <T>(url: string, config?: Record<string, unknown>) => {
        const response = await axiosInstance.delete<T>(url, config);
        return response.data;
    },
};

export default axiosClient;
