import api from "@/lib/axios";
import { ProviderProfile } from "@/types";

type ProviderProfileUpdatePayload = Partial<
  Pick<ProviderProfile, "shopName" | "address" | "cuisine">
>;

export const providerService = {
  getAll: async () => {
    const response = await api.get("/providers");
    return response.data.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/providers/${id}`);
    return response.data.data;
  },
  getStats: async () => {
    const response = await api.get("/provider/stats");
    return response.data.data;
  },
  getProfile: async () => {
    const response = await api.get("/provider/profile");
    return response.data.data;
  },
  updateProfile: async (data: ProviderProfileUpdatePayload) => {
    const response = await api.patch("/provider/profile", data);
    return response.data;
  }
};
