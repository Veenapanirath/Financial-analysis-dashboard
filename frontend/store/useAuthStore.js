'use client';

import { create } from 'zustand';
import { authAPI } from '@/lib/api';
import { setToken, setUser, removeToken, removeUser, getToken, getUser, isTokenExpired } from '@/lib/auth';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isInitialized: false,

  initialize: () => {
    const token = getToken();
    const user = getUser();
    if (token && !isTokenExpired(token)) {
      set({ user, token, isInitialized: true });
    } else {
      removeToken();
      removeUser();
      set({ user: null, token: null, isInitialized: true });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.login(email, password);
      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      set({ user, token, isLoading: false, error: null });
      return true;
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed. Please try again.';
      set({ isLoading: false, error: message });
      return false;
    }
  },

  register: async (email, password, name, monthlyBudget) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.register(email, password, name, monthlyBudget);
      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      set({ user, token, isLoading: false, error: null });
      return true;
    } catch (error) {
      const message = error.response?.data?.error || 'Registration failed. Please try again.';
      set({ isLoading: false, error: message });
      return false;
    }
  },

  logout: () => {
    removeToken();
    removeUser();
    set({ user: null, token: null, error: null });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
