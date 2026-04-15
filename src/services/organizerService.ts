import api from "@/lib/axios";

export type OrganizerStats = {
  activeOffers: number;
  newsletterSubscribers: number;
  publishedBlogs: number;
  homeContentActive: number;
};

export const organizerService = {
  getStats: async () => {
    const response = await api.get("/organizer/stats");
    return response.data.data as OrganizerStats;
  },
};

