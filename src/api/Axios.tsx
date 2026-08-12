import axios from 'axios';
import { apiBaseUrl } from '../utils/constants';

const api = axios.create({
    baseURL: apiBaseUrl,
});

api.interceptors.request.use((config) => {
    const token = JSON.parse(localStorage.getItem('token'));

    if (!config.url.includes('/login') && token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;
