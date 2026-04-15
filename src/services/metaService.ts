import api from "@/lib/axios";

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  category: string;
  createdAt?: string;
};

export type HomeContent = {
  hero: {
    image: string;
    trustScore: number;
    reviewRating: number;
    reviewCountLabel: string;
    avgDeliveryTime: string;
  };
  processSteps: { title: string; desc: string }[];
  story: {
    image: string;
    yearsOfTrust: number;
    title: string;
    description: string;
    activeEatersLabel: string;
    activeEatersValue: string;
    globalCitiesLabel: string;
    globalCitiesValue: string;
    ctaText: string;
  };
  mobileApp: {
    image: string;
    features: string[];
  };
};

export const metaService = {
  getStats: async () => {
    try {
      const response = await api.get("/meta/stats");
      return response.data.data;
    } catch {
      return {
        customers: 0,
        chefs: 0,
        meals: 0,
        radius: 0,
        deliveredOrders: 0,
        rating: 0,
      };
    }
  },
  getOffers: async () => {
    try {
      const response = await api.get("/meta/offers");
      return response.data.data;
    } catch {
      return [];
    }
  },
  getBlogs: async (): Promise<BlogPost[]> => {
    try {
      const response = await api.get("/meta/blogs");
      return response.data.data;
    } catch {
      return [];
    }
  },
  getBlogById: async (id: string): Promise<BlogPost> => {
    const response = await api.get(`/meta/blogs/${id}`);
    return response.data.data;
  },
  getHomeContent: async (): Promise<HomeContent> => {
    const response = await api.get("/meta/home-content");
    return response.data.data;
  },
  validateOfferCode: async (code: string, subtotal: number) => {
    const response = await api.post("/meta/offers/validate", { code, subtotal });
    return response.data.data as {
      code: string;
      title: string;
      discountType: "PERCENTAGE" | "FIXED";
      discountValue: number;
      discountAmount: number;
      subtotal: number;
      finalTotal: number;
    };
  },
  subscribeNewsletter: async (email: string) => {
    const response = await api.post("/meta/newsletter", { email });
    return response.data;
  },
};
