/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/lib/axios';

export const orderService = {
  createOrder: async (orderData: any) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  getMyOrders: async () => {
    const response = await api.get('/orders');
    return response.data.data;
  },

  getMyStats: async () => {
    const response = await api.get('/orders/stats');
    return response.data.data;
  },

  getOrderDetails: async (id: string) => {
    const response = await api.get(`/orders/${id}`);
    return response.data.data;
  },

  getProviderOrders: async () => {
    const response = await api.get('/provider/orders');
    return response.data.data;
  },

  updateOrderStatus: async (id: string, status: string) => {
    const response = await api.patch(`/provider/orders/${id}`, { status });
    return response.data;
  },
};
