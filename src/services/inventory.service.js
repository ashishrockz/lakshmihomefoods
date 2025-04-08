import api from './api';
import config from '../config';

const getAllInventoryItems = async (page = 1, limit = 10, search = '') => {
  try {
    let url = `${config.INVENTORY.ALL}?page=${page}&limit=${limit}`;
    
    if (search) {
      url += `&search=${search}`;
    }
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getInventoryItemById = async (id) => {
  try {
    const response = await api.get(`${config.INVENTORY.ALL}${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateInventoryQuantity = async (id, quantityChange, note) => {
  try {
    const response = await api.post(`${config.INVENTORY.ALL}${id}/update_quantity/`, {
      quantity_change: quantityChange,
      note
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getInventoryHistory = async (id, page = 1, limit = 10) => {
  try {
    const response = await api.get(`${config.INVENTORY.ALL}${id}/history/?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getLowStockItems = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(`${config.INVENTORY.LOW_STOCK}?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Batches
const getAllBatches = async (page = 1, limit = 10, search = '') => {
  try {
    let url = `${config.INVENTORY.BATCHES}?page=${page}&limit=${limit}`;
    
    if (search) {
      url += `&search=${search}`;
    }
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getBatchById = async (id) => {
  try {
    const response = await api.get(`${config.INVENTORY.BATCHES}${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createBatch = async (batchData) => {
  try {
    const response = await api.post(config.INVENTORY.BATCHES, batchData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateBatch = async (id, batchData) => {
  try {
    const response = await api.put(`${config.INVENTORY.BATCHES}${id}/`, batchData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteBatch = async (id) => {
  try {
    const response = await api.delete(`${config.INVENTORY.BATCHES}${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const receiveBatch = async (id, receivedQuantity, notes) => {
  try {
    const response = await api.post(`${config.INVENTORY.BATCHES}${id}/receive/`, {
      received_quantity: receivedQuantity,
      notes
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const inventoryService = {
  getAllInventoryItems,
  getInventoryItemById,
  updateInventoryQuantity,
  getInventoryHistory,
  getLowStockItems,
  getAllBatches,
  getBatchById,
  createBatch,
  updateBatch,
  deleteBatch,
  receiveBatch
};

export default inventoryService;