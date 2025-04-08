const API_URL = 'https://lakshmihomefoods.vercel.app';

export default {
  API_URL,
  AUTH: {
    LOGIN: `${API_URL}/auth/login/`,
    REGISTER: `${API_URL}/auth/register/`,
    REFRESH: `${API_URL}/auth/login/refresh/`,
    LOGOUT: `${API_URL}/auth/logout/`,
    PROFILE: `${API_URL}/auth/profile/`,
    CHANGE_PASSWORD: `${API_URL}/auth/password/change/`
  },
  PRODUCTS: {
    CATEGORIES: `${API_URL}/products/categories/`,
    ALL: `${API_URL}/products/`,
    SEARCH: `${API_URL}/search/`
  },
  INVENTORY: {
    BATCHES: `${API_URL}/inventory/batches/`,
    ALL: `${API_URL}/inventory/`,
    LOW_STOCK: `${API_URL}/inventory/low_stock/`
  },
  ORDERS: {
    ALL: `${API_URL}/orders/`,
    UPDATE_STATUS: (id) => `${API_URL}/orders/${id}/update_status/`,
    CANCEL: (id) => `${API_URL}/orders/${id}/cancel/`
  },
  PAYMENTS: {
    ALL: `${API_URL}/payments/`,
    CREATE_INTENT: `${API_URL}/payments/create-payment-intent/`,
    CONFIRM: `${API_URL}/payments/confirm-payment/`
  },
  TOKEN_KEY: 'forted_admin_token',
  REFRESH_TOKEN_KEY: 'forted_admin_refresh_token'
};