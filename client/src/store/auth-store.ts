// src/store/auth-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/auth.type';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user: User, token: string) => 
        set({ user, token, isAuthenticated: true }),
      clearAuth: () => 
        set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage', // name of the item in localStorage
    }
  )
);

// Intercept axios calls to add token
import api from '@/services/api';

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from store
    const state = useAuthStore.getState();
    if (state.token) {
      config.headers['Authorization'] = `Bearer ${state.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth store on unauthorized
      useAuthStore.getState().clearAuth();
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);