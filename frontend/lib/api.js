import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================
// AUTH API CALLS
// ============================================
export const authAPI = {
  register: (email, password, name, monthlyBudget) =>
    api.post('/auth/register', { email, password, name, monthlyBudget }),

  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  getCurrentUser: () =>
    api.get('/auth/me'),

  logout: () =>
    api.post('/auth/logout'),
};

// ============================================
// TRANSACTIONS API CALLS
// ============================================
export const transactionsAPI = {
  getAll: (category, startDate, endDate, limit = 50, page = 1) =>
    api.get('/transactions', {
      params: { category, startDate, endDate, limit, page },
    }),

  getById: (id) =>
    api.get(`/transactions/${id}`),

  create: (transaction) =>
    api.post('/transactions', transaction),

  update: (id, transaction) =>
    api.put(`/transactions/${id}`, transaction),

  delete: (id) =>
    api.delete(`/transactions/${id}`),

  bulkDelete: (ids) =>
    api.delete('/transactions', { data: { ids } }),
};

// ============================================
// ANALYTICS API CALLS
// ============================================
export const analyticsAPI = {
  getSummary: (month) =>
    api.get('/analytics/summary', { params: { month } }),

  getBreakdown: (startDate, endDate) =>
    api.get('/analytics/breakdown', { params: { startDate, endDate } }),

  getTrends: (months = 6) =>
    api.get('/analytics/trends', { params: { months } }),

  getBudgetVsActual: (month) =>
    api.get('/analytics/budget-vs-actual', { params: { month } }),

  getMetrics: () =>
    api.get('/analytics/metrics'),
};

// ============================================
// BUDGETS API CALLS
// ============================================
export const budgetsAPI = {
  getAll: (month) =>
    api.get('/budgets', { params: { month } }),

  create: (budget) =>
    api.post('/budgets', budget),

  update: (id, budget) =>
    api.put(`/budgets/${id}`, budget),

  delete: (id) =>
    api.delete(`/budgets/${id}`),
};

export default api;
