import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTokens, isTokenExpired } from '../utils/tokenUtils';
import { getProfileApi } from '../services/auth.service';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const { accessToken } = getTokens();
      if (accessToken && !isTokenExpired(accessToken)) {
        try {
          const profile = await getProfileApi();
          setUser({ ...profile, user_type: profile.user_type });
          setIsAuthenticated(true);
        } catch (error) {
          setIsAuthenticated(false);
          setUser(null);
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, setIsAuthenticated, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};