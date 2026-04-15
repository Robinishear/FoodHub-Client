import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const aiService = {
  chat: async (message: string) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/ai/chat`,
      { message },
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    );
    return response.data;
  },
  
  generateDescription: async (title: string, category: string) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/ai/generate-description`, { title, category }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }
};
