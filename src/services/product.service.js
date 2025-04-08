import api from './api';
import config from '../config';

const getAllProducts = async (page = 1, limit = 10, search = '', categoryId = null) => {
  try {
    let url = `${config.PRODUCTS.ALL}?page=${page}&limit=${limit}`;
    
    if (search) {
      url += `&search=${search}`;
    }
    
    if (categoryId) {
      url += `&category=${categoryId}`;
    }
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getProductById = async (id) => {
  try {
    const response = await api.get(`${config.PRODUCTS.ALL}${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createProduct = async (productData) => {
  try {
    // Handle file uploads with FormData
    const formData = new FormData();
    
    // Add all regular fields
    Object.keys(productData).forEach(key => {
      if (key !== 'image' && key !== 'variants') {
        formData.append(key, productData[key]);
      }
    });
    
    // Add variants as JSON string
    if (productData.variants) {
      formData.append('variants', JSON.stringify(productData.variants));
    }
    
    // Add image if present
    if (productData.image) {
      formData.append('image', productData.image);
    }
    
    const response = await api.post(config.PRODUCTS.ALL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateProduct = async (id, productData) => {
  try {
    // Handle file uploads with FormData
    const formData = new FormData();
    
    // Add all regular fields
    Object.keys(productData).forEach(key => {
      if (key !== 'image' && key !== 'variants') {
        formData.append(key, productData[key]);
      }
    });
    
    // Add variants as JSON string
    if (productData.variants) {
      formData.append('variants', JSON.stringify(productData.variants));
    }
    
    // Add image if present
    if (productData.image) {
      formData.append('image', productData.image);
    }
    
    const response = await api.put(`${config.PRODUCTS.ALL}${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`${config.PRODUCTS.ALL}${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const searchProducts = async (query) => {
  try {
    const response = await api.get(`${config.PRODUCTS.SEARCH}?q=${query}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Category methods
const getAllCategories = async () => {
  try {
    const response = await api.get(config.PRODUCTS.CATEGORIES);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getCategoryById = async (id) => {
  try {
    const response = await api.get(`${config.PRODUCTS.CATEGORIES}${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createCategory = async (categoryData) => {
  try {
    const response = await api.post(config.PRODUCTS.CATEGORIES, categoryData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateCategory = async (id, categoryData) => {
  try {
    const response = await api.put(`${config.PRODUCTS.CATEGORIES}${id}/`, categoryData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteCategory = async (id) => {
  try {
    const response = await api.delete(`${config.PRODUCTS.CATEGORIES}${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const productService = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};

export default productService;
