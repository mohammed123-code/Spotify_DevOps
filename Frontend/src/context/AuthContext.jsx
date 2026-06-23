import React, { createContext, useState, useEffect } from 'react';
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const res = await api.get('/api/user/profile');
          setUser(res.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to restore auth session:', error);
          localStorage.clear();
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    checkAuth();

    // Listen to global logout event triggered by axios interceptor
    const handleLogoutEvent = () => {
      setUser(null);
      setIsAuthenticated(false);
    };
    window.addEventListener('auth_logout', handleLogoutEvent);

    return () => {
      window.removeEventListener('auth_logout', handleLogoutEvent);
    };
  }, []);

  // Login
  const login = async (email, password) => {
    try {
      const res = await api.post('/api/auth/login', { email, password });
      const { accessToken, refreshToken, user: userData } = res.data;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed. Please check your credentials.'
      };
    }
  };

  // Register
  const register = async (username, email, password) => {
    try {
      const res = await api.post('/api/auth/register', { username, email, password });
      const { accessToken, refreshToken, user: userData } = res.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed.'
      };
    }
  };

  // Logout
  const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        await api.post('/api/auth/logout', { refreshToken });
      } catch (error) {
        console.error('Logout API call failed:', error);
      }
    }
    localStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Forgot password OTP request
  const forgotPassword = async (email) => {
    try {
      await api.post('/api/auth/forgot-password', { email });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to send OTP.'
      };
    }
  };

  // Verify OTP and reset password
  const verifyOTP = async (email, otp, newPassword) => {
    try {
      const res = await api.post('/api/auth/verify-otp', { email, otp, newPassword });
      return { success: true, message: res.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to verify OTP.'
      };
    }
  };

  // Update profile
  const updateProfile = async (username, profileImage) => {
    try {
      const res = await api.put('/api/user/profile', { username, profile_image: profileImage });
      setUser(prev => ({
        ...prev,
        username: res.data.user.username,
        profile_image: res.data.user.profile_image
      }));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update profile.'
      };
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      await api.put('/api/user/change-password', { currentPassword, newPassword });
      // Changing password automatically logouts other devices, but we can keep current session
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to change password.'
      };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      login,
      register,
      logout,
      forgotPassword,
      verifyOTP,
      updateProfile,
      changePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};
