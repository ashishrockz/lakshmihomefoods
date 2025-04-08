import api from './api';
import config from '../config';

const getAllUsers = async (page = 1, limit = 10, search = '') => {
  try {
    let url = `${config.AUTH.PROFILE}/users/?page=${page}&limit=${limit}`;
    
    if (search) {
      url += `&search=${search}`;
    }
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getUserById = async (id) => {
  try {
    const response = await api.get(`${config.AUTH.PROFILE}/users/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createUser = async (userData) => {
  try {
    const response = await api.post(`${config.AUTH.PROFILE}/users/`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`${config.AUTH.PROFILE}/users/${id}/`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteUser = async (id) => {
  try {
    const response = await api.delete(`${config.AUTH.PROFILE}/users/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateProfile = async (profileData) => {
  try {
    const response = await api.put(config.AUTH.PROFILE, profileData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const userService = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateProfile
};

export default userService;