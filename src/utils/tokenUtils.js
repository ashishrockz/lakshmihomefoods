import { jwtDecode } from 'jwt-decode'; // Changed from default import to named import
import config from '../config';

export const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem(config.TOKEN_KEY, accessToken);
  localStorage.setItem(config.REFRESH_TOKEN_KEY, refreshToken);
};

export const getTokens = () => {
  return {
    accessToken: localStorage.getItem(config.TOKEN_KEY),
    refreshToken: localStorage.getItem(config.REFRESH_TOKEN_KEY),
  };
};
// Add this to your tokenUtils.js file
export const isRefreshTokenValid = () => {
  const { refreshToken } = getTokens();
  return !!refreshToken; 
};
export const clearTokens = () => {
  localStorage.removeItem(config.TOKEN_KEY);
  localStorage.removeItem(config.REFRESH_TOKEN_KEY);
};

export const isTokenValid = () => {
  const accessToken = localStorage.getItem(config.TOKEN_KEY);

  if (!accessToken) return false;

  try {
    const decoded = jwtDecode(accessToken); // Updated to use jwtDecode
    const currentTime = Date.now() / 1000;

    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};