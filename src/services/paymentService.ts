import api from '@/lib/axios';

export const paymentService = {
  getConfig: async () => {
    const response = await api.get('/payments/config');
    return response.data.data as {
      publishableKey: string;
      currency: string;
    };
  },

  createIntent: async (orderId: string) => {
    const response = await api.post('/payments/intent', { orderId });
    return response.data.data as {
      clientSecret: string;
      paymentIntentId: string;
      amount: number;
      currency: string;
    };
  },

  createCheckoutSession: async (orderId: string) => {
    const response = await api.post('/payments/checkout-session', { orderId });
    return response.data.data as {
      sessionId: string;
      url: string;
    };
  },

  syncStatus: async (orderId: string, paymentIntentId: string) => {
    const response = await api.post('/payments/sync', { orderId, paymentIntentId });
    return response.data.data;
  },
};
