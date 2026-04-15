import api from "@/lib/axios";

export type VendorStats = {
  totalMeals: number;
  totalOrders: number;
  pendingOrders: number;
  averageRating: number;
  revenue7d: number;
  profileCompletenessScore: number;
  profileCompletenessMax: number;
};

export const vendorService = {
  getStats: async () => {
    const response = await api.get("/vendor/stats");
    return response.data.data as VendorStats;
  },
};

