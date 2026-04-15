import api from "@/lib/axios";

export type ManagerStats = {
  managedRevenue7d: number;
  pendingOrders: number;
  activeProviders: number;
  deliveredOrders7d: number;
  newCustomers7d: number;
};

export const managerService = {
  // Stats
  getStats: async () => {
    try {
      const response = await api.get("/manager/stats");
      return response.data.data as ManagerStats;
    } catch (error) {
      // Fallback to admin stats if manager endpoint doesn't exist
      try {
        const adminResponse = await api.get("/admin/stats");
        return adminResponse.data.data as ManagerStats;
      } catch (fallbackError) {
        throw new Error("Stats endpoint not available");
      }
    }
  },

  // Order Management
  getAllOrders: async () => {
    try {
      const response = await api.get('/manager/orders');
      return response.data.data;
    } catch (error) {
      // Fallback to admin orders if manager endpoint doesn't exist
      const response = await api.get('/admin/orders');
      return response.data.data;
    }
  },

  // Category Management
  categories: {
    create: async (name: string) => {
      try {
        const response = await api.post('/manager/categories', { name });
        return response.data;
      } catch (error) {
        // Fallback to admin endpoint
        const response = await api.post('/admin/categories', { name });
        return response.data;
      }
    },
    update: async (id: string, name: string) => {
      try {
        const response = await api.put(`/manager/categories/${id}`, { name });
        return response.data;
      } catch (error) {
        // Fallback to admin endpoint
        const response = await api.put(`/admin/categories/${id}`, { name });
        return response.data;
      }
    },
    delete: async (id: string) => {
      try {
        const response = await api.delete(`/manager/categories/${id}`);
        return response.data;
      } catch (error) {
        // Fallback to admin endpoint
        const response = await api.delete(`/admin/categories/${id}`);
        return response.data;
      }
    },
  },

  // Review Management
  reviews: {
    getAll: async () => {
      try {
        const response = await api.get('/manager/reviews');
        return response.data.data;
      } catch (error) {
        // Fallback to admin endpoint
        const response = await api.get('/admin/reviews');
        return response.data.data;
      }
    },
    delete: async (id: string) => {
      try {
        const response = await api.delete(`/manager/reviews/${id}`);
        return response.data;
      } catch (error) {
        // Fallback to admin endpoint
        const response = await api.delete(`/admin/reviews/${id}`);
        return response.data;
      }
    },
  },

  // Offer Management
  offers: {
    getAll: async () => {
      try {
        const response = await api.get('/manager/offers');
        return response.data.data;
      } catch (error) {
        // Fallback to admin endpoint
        const response = await api.get('/admin/offers');
        return response.data.data;
      }
    },
    create: async (payload: {
      title: string;
      description: string;
      image?: string;
      tag: string;
      color: string;
      code: string;
      discountType: 'PERCENTAGE' | 'FIXED';
      discountValue: number;
      minOrderAmount?: number;
      maxDiscountAmount?: number | null;
      startsAt?: string | null;
      expiresAt?: string | null;
      usageLimit?: number | null;
      isActive?: boolean;
    }) => {
      try {
        const response = await api.post('/manager/offers', payload);
        return response.data;
      } catch (error) {
        // Fallback to admin endpoint
        const response = await api.post('/admin/offers', payload);
        return response.data;
      }
    },
    update: async (
      id: string,
      payload: Partial<{
        title: string;
        description: string;
        image: string;
        tag: string;
        color: string;
        code: string;
        discountType: 'PERCENTAGE' | 'FIXED';
        discountValue: number;
        minOrderAmount: number;
        maxDiscountAmount: number | null;
        startsAt: string | null;
        expiresAt: string | null;
        usageLimit: number | null;
        usedCount: number;
        isActive: boolean;
      }>,
    ) => {
      try {
        const response = await api.patch(`/manager/offers/${id}`, payload);
        return response.data;
      } catch (error) {
        // Fallback to admin endpoint
        const response = await api.patch(`/admin/offers/${id}`, payload);
        return response.data;
      }
    },
    delete: async (id: string) => {
      try {
        const response = await api.delete(`/manager/offers/${id}`);
        return response.data;
      } catch (error) {
        // Fallback to admin endpoint
        const response = await api.delete(`/admin/offers/${id}`);
        return response.data;
      }
    },
  },
};

