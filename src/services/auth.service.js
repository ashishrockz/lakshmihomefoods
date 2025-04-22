import api from './api';
import config from '../config';
import { setTokens, clearTokens } from '../utils/tokenUtils';

export const loginApi = async (username, password) => {
  try {
    const response = await api.post(config.AUTH.LOGIN, {
      username,
      password,
    });
    const { access, refresh, user_type } = response.data;
    setTokens(access, refresh);
    return { ...response.data, user_type };
  } catch (error) {
    throw error.response?.data?.error || error.message || 'Login failed';
  }
};

export const logoutApi = () => {
  clearTokens();
};

export const register = async (userData) => {
  try {
    const response = await api.post(config.AUTH.REGISTER, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message || 'Registration failed';
  }
};

export const getProfileApi = async () => {
  try {
    const response = await api.get(config.AUTH.PROFILE);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message || 'Could not fetch profile';
  }
};

export const changePassword = async (oldPassword, newPassword) => {
  try {
    const response = await api.post(config.AUTH.CHANGE_PASSWORD, {
      old_password: oldPassword,
      new_password: newPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message || 'Password change failed';
  }
};

export const requestPasswordReset = async (email) => {
  try {
    const response = await api.post(config.AUTH.FORGOT_PASSWORD, { email });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message || 'Password reset request failed';
  }
};

export const resetPassword = async (uidb64, token, newPassword) => {
  try {
    const response = await api.post(`${config.AUTH.RESET_PASSWORD}${uidb64}/${token}/`, {
      new_password: newPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message || 'Password reset failed';
  }
};