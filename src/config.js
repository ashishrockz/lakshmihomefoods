const config = {
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  AUTH: {
    LOGIN: '/auth/login/',
    REGISTER: '/auth/register/',
    REFRESH: '/auth/refresh/',
    PROFILE: '/auth/profile/',
    CHANGE_PASSWORD: '/auth/change-password/',
    FORGOT_PASSWORD: '/auth/forgot-password/',
    RESET_PASSWORD: '/auth/reset-password/'
  },
  ENDPOINTS: {
    PRODUCTS: '/products',
    CATEGORIES: '/products/categories',
    INVENTORY: '/inventory',
    BATCHES: '/batches',
    ORDERS: '/orders',
    PAYMENTS: '/payments',
    USERS: '/users'
  }
};

export default config;