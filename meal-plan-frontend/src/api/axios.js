import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5016/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// This interceptor checks for 401 Unauthorized responses and redirects the user to the login page if their token is invalid or expired.
api.interceptors.response.use(
    (response) => response,
    (error) => {
    if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }
    return Promise.reject(error);
    }
);

export default api;