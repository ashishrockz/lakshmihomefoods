import api from './api';
import config from '../config';

// Ensure base URL has a trailing slash
const API_BASE = config.API_URL? config.API_URL : `${config.API_URL}`;

// Product methods
export async function getAllProducts(page = 1, limit = 10, search = '', categoryId = null) {
  try {
    let url = `${API_BASE}${config.ENDPOINTS.PRODUCTS}/?page=${page}&limit=${limit}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (categoryId) url += `&category=${categoryId}`;
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error in getAllProducts:', error.response?.data || error.message);
    throw error;
  }
}

export async function getProductById(id) {
  try {
    const response = await api.get(`${API_BASE}${config.ENDPOINTS.PRODUCTS}/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error in getProductById:', error.response?.data || error.message);
    throw error;
  }
}

export async function createProduct(productData) {
  try {
    const formData = new FormData();
    Object.keys(productData).forEach(key => {
      if (key !== 'image' && key !== 'variants') {
        formData.append(key, productData[key]);
      }
    });
    if (productData.variants) {
      formData.append('variants', JSON.stringify(productData.variants));
    }
    if (productData.image) {
      formData.append('image', productData.image);
    }
    
    const response = await api.post(`${API_BASE}${config.ENDPOINTS.PRODUCTS}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error('Error in createProduct:', error.response?.data || error.message);
    throw error;
  }
}

export async function updateProduct(id, productData) {
  try {
    const formData = new FormData();
    Object.keys(productData).forEach(key => {
      if (key !== 'image' && key !== 'variants') {
        formData.append(key, productData[key]);
      }
    });
    if (productData.variants) {
      formData.append('variants', JSON.stringify(productData.variants));
    }
    if (productData.image) {
      formData.append('image', productData.image);
    }
    
    const response = await api.put(`${API_BASE}${config.ENDPOINTS.PRODUCTS}/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error('Error in updateProduct:', error.response?.data || error.message);
    throw error;
  }
}

export async function deleteProduct(id) {
  try {
    const response = await api.delete(`${API_BASE}${config.ENDPOINTS.PRODUCTS}/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error in deleteProduct:', error.response?.data || error.message);
    throw error;
  }
}

export async function searchProducts(query) {
  try {
    const response = await api.get(`${API_BASE}${config.ENDPOINTS.PRODUCTS}/search/?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error('Error in searchProducts:', error.response?.data || error.message);
    throw error;
  }
}

// Category methods
export async function getAllCategories() {
  try {
    const response = await api.get(`${API_BASE}${config.ENDPOINTS.CATEGORIES}`);
    return response.data;
  } catch (error) {
    console.error('Error in getAllCategories:', error.response?.data || error.message);
    throw error;
  }
}

export async function getCategoryById(slug) {  // Changed 'id' to 'slug' to match backend
  try {
    const response = await api.get(`${API_BASE}${config.ENDPOINTS.CATEGORIES}/${slug}`);
    return response.data;
  } catch (error) {
    console.error('Error in getCategoryById:', error.response?.data || error.message);
    throw error;
  }
}

export async function createCategory(categoryData) {
  try {
    const response = await api.post(`${API_BASE}${config.ENDPOINTS.CATEGORIES}`, categoryData);
    return response.data;
  } catch (error) {
    console.error('Error in createCategory:', error.response?.data || error.message);
    throw error;
  }
}

export async function updateCategory(slug, categoryData) {  // Changed 'id' to 'slug'
  try {
    const response = await api.put(`${API_BASE}${config.ENDPOINTS.CATEGORIES}/${slug}`, categoryData);
    return response.data;
  } catch (error) {
    console.error('Error in updateCategory:', error.response?.data || error.message);
    throw error;
  }
}

export async function deleteCategory(slug) {  // Changed 'id' to 'slug'
  try {
    const response = await api.delete(`${API_BASE}${config.ENDPOINTS.CATEGORIES}/${slug}`);
    return response.data;
  } catch (error) {
    console.error('Error in deleteCategory:', error.response?.data || error.message);
    throw error;
  }
}