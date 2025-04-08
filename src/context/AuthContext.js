import React, { createContext, useState, useEffect } from 'react';
import { loginApi, logoutApi, getProfileApi} from '../services/auth.service.js';
import { getTokens } from '../utils/tokenUtils.js';

// Create the context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const { accessToken } = getTokens();
        
        if (accessToken) {
          // Get user profile data
          const userData = await getProfileApi();
          setCurrentUser(userData);
          setIsAuthenticated(true);
          setIsAdmin(userData.role === 'admin');
        }
      } catch (error) {
        // If token is invalid or expired
        logoutApi();
        setCurrentUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email, password) => {
    const response = await loginApi(email, password);
    const userData = await getProfileApi();
    
    setCurrentUser(userData);
    setIsAuthenticated(true);
    setIsAdmin(userData.role === 'admin');
    
    return response;
  };

  // Logout function
  const logout = () => {
    logoutApi();
    setCurrentUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  // Update user profile
  const updateProfile = (userData) => {
    setCurrentUser({ ...currentUser, ...userData });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        isAdmin,
        loading,
        login,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};