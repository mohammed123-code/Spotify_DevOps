import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

// Request Interceptor: Attach Access Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Auto Refresh Token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if error is 401, has code TOKEN_EXPIRED, and hasn't been retried yet
    if (
      error.response?.status === 401 && 
      error.response?.data?.code === 'TOKEN_EXPIRED' && 
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        // No refresh token available, log out
        localStorage.clear();
        window.dispatchEvent(new Event('auth_logout'));
        return Promise.reject(error);
      }

      try {
        // Request a new access token
        const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/refresh-token`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = res.data;
        
        // Save new tokens
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        
        // Retry the original request with new token
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token failed/expired too, log out
        console.error('Refresh token expired or invalid', refreshError);
        localStorage.clear();
        window.dispatchEvent(new Event('auth_logout'));
        return Promise.reject(refreshError);
      }
    }

    // Handle generic 401 errors (e.g. invalid signature, missing token)
    if (error.response?.status === 401 && !originalRequest._retry) {
      localStorage.clear();
      window.dispatchEvent(new Event('auth_logout'));
    }

    return Promise.reject(error);
  }
);

export default api;
