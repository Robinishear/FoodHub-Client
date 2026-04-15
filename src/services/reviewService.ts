import api from '@/lib/axios';

export const reviewService = {
  // Get reviews for a specific meal
  getMealReviews: async (mealId: string) => {
    const response = await api.get(`/reviews/meal/${mealId}`);
    return response.data.data;
  },

  // Create a new review
  createReview: async (reviewData: {
    mealId: string;
    orderId: string;
    rating: number;
    comment?: string;
  }) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  // Get user's own reviews
  getMyReviews: async () => {
    const response = await api.get('/reviews/my');
    return response.data.data;
  },
  getPublicTestimonials: async () => {
    try {
      const response = await api.get('/reviews/testimonials');
      return response.data.data;
    } catch {
      return [];
    }
  },
};
