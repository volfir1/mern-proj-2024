// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext(null);

// Define useAuth as a named function
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Define AuthProvider as a named function component
function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user is logged in on mount
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (storedUser && token) {
          // Optionally verify token with backend
          try {
            await authAPI.checkAuth();
            setUser(JSON.parse(storedUser));
          } catch (err) {
            // If token is invalid, clear storage
            localStorage.removeItem('user');
            localStorage.removeItem('token');
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const register = async (userData) => {
    try {
      setError(null);
      const data = await authAPI.register(userData);
      if (data.user) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
      }
      return data;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      // This is the correct way to call the API
      const response = await authAPI.login({
        email,
        password
      });
      if (response.user) {
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
      }
      return response;
    } catch (error) {
      setError(error.message || 'Login failed');
      throw error;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await authAPI.logout();
      
      // Clear both types of storage
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      setUser(null);
    } catch (err) {
      setError(err.message || 'Logout failed');
      // Still clear storage on error
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      setUser(null);
      throw err;
    }
  };

  const clearError = () => setError(null);

  const value = {
    user,
    loading,
    error,
    setError: clearError,
    register,
    login,
    logout,
    isAuthenticated: !!user
  };

  if (loading) {
    // You can return a loading spinner or null here
    return null;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, useAuth };