// utils/authApi.js
import axiosInstance from '../utils/api';

// Helper function for handling response
const handleResponse = (response) => {
  if (response.status >= 400) {
    throw new Error(`Failed to fetch data: ${response.statusText}. ${response.data}`);
  }
  return response.data;
};

// User Registration
export const registerUser = async (userData) => {
  try {
    // Updated to match your server route '/api/auth/register'
    const response = await axiosInstance.post('/auth/register', userData, { 
      timeout: 10000 
    });
    return handleResponse(response);
  } catch (error) {
    throw new Error(`Failed to register user: ${error.message}`);
  }
};

// User Login
export const loginUser = async (credentials) => {
    try {
      // Updated to match your server route '/api/auth/login'
      const response = await axiosInstance.post('/auth/login', credentials, { 
        timeout: 10000 
      });
      
      // If login is successful, store the token
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        // Optionally store user data
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      }
      
      return handleResponse(response);
    } catch (error) {
      // Better error handling
      const errorMessage = error.response?.data?.message || error.message || 'Failed to log in';
      throw new Error(errorMessage);
    }
  };

// Fetch User Profile
export const fetchUserProfile = async (token) => {
  try {
    // Updated to match your server route '/api/auth/profile'
    const response = await axiosInstance.get('/auth/profile', {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 10000,
    });
    return handleResponse(response);
  } catch (error) {
    throw new Error(`Failed to fetch user profile: ${error.message}`);
  }
};