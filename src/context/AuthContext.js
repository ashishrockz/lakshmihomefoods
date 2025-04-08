import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import { isTokenValid, setTokens, clearTokens, getTokens, isRefreshTokenValid } from '../utils/tokenUtils';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Setup axios interceptor for token refresh
  useEffect(() => {
    // Add a response interceptor to handle token refresh
    const interceptor = axios.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;
        
        // If error is 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry && isRefreshTokenValid()) {
          originalRequest._retry = true;
          
          try {
            // Try to refresh the token
            const { refreshToken } = getTokens();
            const response = await axios.post(config.AUTH.REFRESH_TOKEN, {
              refresh: refreshToken
            });
            
            // Save new tokens
            const { access, refresh } = response.data;
            setTokens(access, refresh);
            
            // Retry original request with new token
            originalRequest.headers['Authorization'] = `Bearer ${access}`;
            return axios(originalRequest);
          } catch (refreshError) {
            // If refresh fails, log user out
            console.error('Token refresh failed:', refreshError);
            clearTokens();
            setUser(null);
            navigate('/login');
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );
    
    // Clean up interceptor on unmount
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate]);
  
  const fetchUserProfile = useCallback(async (token) => {
    try {
      const response = await axios.get(config.AUTH.PROFILE, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Check if user has proper permissions
      if (response.data.role !== 'ADMIN' && response.data.role !== 'STAFF') {
        throw new Error('Unauthorized: Only Admin and Staff can access this portal');
      }
      
      setUser(response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      clearTokens();
      setUser(null);
      throw error;
    }
  }, []);
  
  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!isTokenValid()) {
          setLoading(false);
          return;
        }
        
        const { accessToken } = getTokens();
        await fetchUserProfile(accessToken);
      } catch (error) {
        console.error('Auth check failed:', error);
        clearTokens();
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [fetchUserProfile]);
  
  const login = async (email, password) => {
    try {
      const response = await axios.post(config.AUTH.LOGIN, {
        email,
        password
      });
      
      const { access, refresh } = response.data;
      setTokens(access, refresh);
      
      // Get user profile and check roles
      const userData = await fetchUserProfile(access);
      
      return userData;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };
  
  const logout = async () => {
    try {
      const { refreshToken } = getTokens();
      if (refreshToken) {
        // Attempt to blacklist the refresh token on the server
        await axios.post(config.AUTH.LOGOUT, {
          refresh_token: refreshToken
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearTokens();
      setUser(null);
      navigate('/login');
    }
  };
  
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const { accessToken } = getTokens();
      const response = await axios.post(config.AUTH.CHANGE_PASSWORD, {
        current_password: currentPassword,
        new_password: newPassword
      }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      return response.data;
    } catch (error) {
      console.error('Password change failed:', error);
      throw error;
    }
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      changePassword,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'ADMIN',
      isStaff: user?.role === 'STAFF',
      refreshUser: () => {
        const { accessToken } = getTokens();
        if (accessToken) {
          return fetchUserProfile(accessToken);
        }
        return Promise.reject(new Error('No access token available'));
      }
    }}>
      {children}
    </AuthContext.Provider>
  );
};