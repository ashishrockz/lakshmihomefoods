import api from './api';
import config from '../config';

export const getPayments = async ({
  page = 1,
  limit = 10,
  sort_by = 'created_at',
  sort_direction = 'desc',
  search = '',
  status = null,
  payment_method = null,
  start_date = null,
  end_date = null,
} = {}) => {
  try {
    let url = `${config.PAYMENTS.ALL}?page=${page}&limit=${limit}&sort_by=${sort_by}&sort_direction=${sort_direction}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (status) url += `&status=${status}`;
    if (payment_method) url += `&payment_method=${payment_method}`;
    if (start_date) url += `&start_date=${start_date}`;
    if (end_date) url += `&end_date=${end_date}`;

    const response = await api.get(url);
    return response.data; // Expected: { payments: [], total: number }
  } catch (error) {
    throw error.response?.data || error;
  }
};