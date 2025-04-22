const config = {
  API_URL: process.env.REACT_APP_API_URL || 'https://lakshmihomefoods.vercel.app/api',
  AUTH: {
    LOGIN: '/login/',
    REGISTER: '/register/',
    REFRESH: '/token/refresh/',
    PROFILE: '/profile/',
    CHANGE_PASSWORD: '/change-password/',
    FORGOT_PASSWORD: '/forgot-password/',
    RESET_PASSWORD: '/reset-password/' // Base path, will append uidb64/token
  },
  ENDPOINTS: {
    PRODUCTS: '/products',
    CATEGORIES: 'categories',
    INVENTORY: '/inventory',
    BATCHES: '/batches',
    ORDERS: '/orders',
    PAYMENTS: '/payments',
    USERS: '/users'
  }
};

export default config;