import { useEffect } from 'react';
import axios from 'axios';
import { getTokens, setTokens, clearTokens, isTokenValid } from '../utils/tokenUtils';
import config from '../config';
import useAuth from './useAuth';

// Create an axios instance
const axiosInstance = axios.create();

export default function useAxios() {
  const { logout } = useAuth();
  
  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      async (config) => {
        const { accessToken } = getTokens();
        
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    
    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        
        // If the error is 401 and we haven't already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const { refreshToken } = getTokens();
            
            if (!refreshToken) {
              logout();
              return Promise.reject(error);
            }
            
            // Try to refresh the token
            const response = await axios.post(config.AUTH.REFRESH, {
              refresh: refreshToken
            });
            
            const { access } = response.data;
            setTokens(access, refreshToken);
            
            // Update the request with new token
            originalRequest.headers.Authorization = `Bearer ${access}`;
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            // If refresh fails, logout
            logout();
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );
    
    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [logout]);
  
  return axiosInstance;
}