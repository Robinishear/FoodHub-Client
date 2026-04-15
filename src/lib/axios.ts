import axios from 'axios';

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    'https://foodhub-backend-api.vercel.app/api',
  withCredentials: true,
  timeout: 30000, // 30 second timeout - increased for better reliability
  // Don't force Content-Type globally; it breaks FormData uploads.
  // Axios will set application/json for JSON bodies and multipart boundaries for FormData.
  headers: {},
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle network errors
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      console.error('Network error: Unable to reach the server');
      error.userMessage =
        'Unable to connect to the server. Please check your internet connection.';
      return Promise.reject(error);
    }

    // Handle timeout errors with retry logic
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      console.error('Request timeout:', error.config?.url || 'Unknown URL');
      
      // Log additional timeout details for debugging
      console.log('Timeout details:', {
        url: error.config?.url,
        method: error.config?.method,
        timeout: error.config?.timeout,
        timestamp: new Date().toISOString()
      });
      
      // Retry logic for GET requests only (avoid duplicate POST/PUT/DELETE)
      const originalRequest = error.config;
      const shouldRetry = 
        originalRequest.method?.toLowerCase() === 'get' && 
        !originalRequest._retry && 
        (originalRequest._retryCount = (originalRequest._retryCount || 0) + 1) <= 2;
      
      if (shouldRetry) {
        console.log(`Retrying request (attempt ${originalRequest._retryCount}):`, originalRequest.url);
        
        // Increase timeout for retry
        originalRequest.timeout = 45000; // 45 seconds for retry
        originalRequest._retry = true;
        
        return api(originalRequest);
      }
      
      error.userMessage = 'Request timed out after multiple attempts. Please check your connection and try again.';
      return Promise.reject(error);
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';

    error.userMessage = message;

    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const publicPaths = ['/login', '/register', '/'];
      const isPublicPath = publicPaths.includes(window.location.pathname);

      if (!isPublicPath) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href =
          '/login?message=Session expired. Please login again.';
      }
    }

    if (error.response?.status === 429) {
      console.warn('Rate limited. Please slow down.');
    }

    return Promise.reject(error);
  }
);

export default api;
