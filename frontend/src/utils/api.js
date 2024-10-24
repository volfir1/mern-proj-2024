// src/utils/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Debug logging
    console.log('Request:', {
      url: `${config.baseURL}${config.url}`,
      method: config.method,
      data: config.data ? {
        ...config.data,
        password: config.data.password ? '[HIDDEN]' : undefined
      } : undefined
    });

    // Add token to headers if it exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Debug logging
    console.log('Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    // Debug logging
    console.error('Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });

    // Handle different error cases
    if (error.response) {
      switch (error.response.status) {
        case 401: // Unauthorized
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // Only redirect to login if not already there
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
          break;

        case 403: // Forbidden
          console.error('Access forbidden');
          window.location.href = '/unauthorized';
          break;

        case 404: // Not found
          console.error('Resource not found');
          break;

        case 422: // Validation error
          console.error('Validation failed:', error.response.data);
          break;

        case 500: // Server error
          console.error('Server error:', error.response.data);
          break;

        default:
          console.error('Unhandled error status:', error.response.status);
      }
    } else if (error.request) {
      // Network error
      console.error('Network error - no response received');
    }

    return Promise.reject(error);
  }
);

// Auth-related API calls
export const authAPI = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

 // Login user
login: async (credentials) => {
  try {
    const response = await axiosInstance.post('/auth/login', credentials);
    if (response.data.token) {
      sessionStorage.setItem('token', response.data.token);
      sessionStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},

  // Logout user
  logout: async () => {
    try {
      await axiosInstance.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await axiosInstance.get('/api/auth/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await axiosInstance.put('/api/auth/profile', userData);
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await axiosInstance.put('/api/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    try {
      const response = await axiosInstance.post('/api/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    try {
      const response = await axiosInstance.post('/api/auth/reset-password', {
        token,
        password: newPassword
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Verify email
  verifyEmail: async (token) => {
    try {
      const response = await axiosInstance.post('/api/auth/verify-email', { token });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Check auth status
  checkAuth: async () => {
    try {
      const response = await axiosInstance.get('/auth/check');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// User-related API calls
export const userAPI = {
  // Get user details
  getUserDetails: async (userId) => {
    try {
      const response = await axiosInstance.get(`/api/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update user settings
  updateSettings: async (settings) => {
    try {
      const response = await axiosInstance.put('/api/users/settings', settings);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default axiosInstance;