import { create } from 'zustand';
import api from '../api/axios';

const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,

  // ======= Register =======
    register: async (data) => {
    set({ loading: true, error: null });
    try {
        const res = await api.post('/auth/register', data);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify({
        name:  res.data.name,
        email: res.data.email,
        role:  res.data.role,
        }));
        set({
        token:   res.data.token,
        user:    { name: res.data.name, email: res.data.email, role: res.data.role },
        loading: false,
        });
        return { success: true };
    } catch (err) {
        set({ error: err.response?.data?.message || 'Register failed', loading: false });
        return { success: false };
    }
    },

  // ======= Login =======
    login: async (data) => {
    set({ loading: true, error: null });
    try {
        const res = await api.post('/auth/login', data);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify({
        name:  res.data.name,
        email: res.data.email,
        role:  res.data.role,
        }));
        set({
        token:   res.data.token,
        user:    { name: res.data.name, email: res.data.email, role: res.data.role },
        loading: false,
        });
        return { success: true };
    } catch (err) {
        set({ error: err.response?.data?.message || 'Login failed', loading: false });
        return { success: false };
    }
    },

  // ======= Logout =======
    logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
    },

    clearError: () => set({ error: null }),
}));

export default useAuthStore;