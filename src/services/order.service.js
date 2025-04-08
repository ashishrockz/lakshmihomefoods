import api from './api';
import config from '../config';

export const getOrders = async (page = 1, limit = 10, search = '', status = null) => {
  try {
    let url = `${config.ORDERS.ALL}?page=${page}&limit=${limit}`;
    if (search) url += `&search=${search}`;
    if (status) url += `&status=${status}`;

    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getOrderById = async (id) => {
  try {
    const response = await api.get(`${config.ORDERS.ALL}${id}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateOrderStatus = async (id, status, notes) => {
  try {
    const response = await api.post(config.ORDERS.UPDATE_STATUS(id), {
      status,
      notes,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const cancelOrder = async (id, reason) => {
  try {
    const response = await api.post(config.ORDERS.CANCEL(id), { reason });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getOrderSummary = async () => {
  try {
    const response = await api.get(`${config.ORDERS.ALL}summary/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getOrderTimeline = async (id) => {
  try {
    const response = await api.get(`${config.ORDERS.ALL}${id}/timeline/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};