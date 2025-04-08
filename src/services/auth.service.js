import api from './api';
import config from '../config';
import { setTokens, clearTokens } from '../utils/tokenUtils';

// Login function
export const login = async (email, password) => {
  try {
    const response = await api.post(config.AUTH.LOGIN, {
      email,
      password,
    });
    const { access, refresh } = response.data;
    setTokens(access, refresh);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Logout function
export const logout = () => {
  clearTokens();
};

// Register function
export const register = async (userData) => {
  try {
    const response = await api.post(config.AUTH.REGISTER, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get user profile
export const getProfile = async () => {
  try {
    const response = await api.get(config.AUTH.PROFILE);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Change password
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.post(config.AUTH.CHANGE_PASSWORD, {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Request password reset (renamed from forgotPassword to match previous error expectation)
export const requestPasswordReset = async (email) => {
  try {
    const response = await api.post(`${config.AUTH.LOGIN}forgot-password/`, { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Reset password
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.post(`${config.AUTH.LOGIN}reset-password/`, {
      token,
      new_password: newPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};