import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';

const API_URL_LOCAL = "http://localhost:8082/api/";


const api = axios.create({
    baseURL: API_URL_LOCAL,
    headers: {
        'Content-Type': 'application/json',
        'Bearer': localStorage.getItem('token') ?? ''
    },
})

api.interceptors.request.use((config: AxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;