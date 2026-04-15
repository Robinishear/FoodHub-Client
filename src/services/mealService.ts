/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/lib/axios';

export const mealService = {
  getCategories: async () => {
    try {
      const response = await api.get('/admin/categories');
      return response.data.data;
    } catch {
      return [];
    }
  },

  getMeals: async (params?: any) => {
    const response = await api.get('/meals', { params });
    return response.data; // Now returns { success, meta, data }
  },

  getMealById: async (id: string) => {
    const response = await api.get(`/meals/${id}`);
    return response.data.data;
  },

  getProviderMeals: async () => {
    const response = await api.get('/provider/meals');
    return response.data.data;
  },

  createMeal: async (data: any) => {
    const response = await api.post('/provider/meals', data);
    return response.data;
  },

  updateMeal: async (id: string, data: any) => {
    const response = await api.put(`/provider/meals/${id}`, data);
    return response.data;
  },

  deleteMeal: async (id: string) => {
    const response = await api.delete(`/provider/meals/${id}`);
    return response.data;
  },
};
