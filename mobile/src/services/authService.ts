import axios from 'axios';
import {User, ApiResponse} from '../types';
import {API_ENDPOINTS, STORAGE_KEYS} from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: API_ENDPOINTS.BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      if (refreshToken) {
        try {
          const response = await axios.post(
            `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`,
            {refreshToken},
          );
          
          const {token} = response.data;
          await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
          
          // Retry the original request
          error.config.headers.Authorization = `Bearer ${token}`;
          return api.request(error.config);
        } catch (refreshError) {
          // Refresh failed, clear tokens
          await AsyncStorage.multiRemove([
            STORAGE_KEYS.AUTH_TOKEN,
            STORAGE_KEYS.REFRESH_TOKEN,
            STORAGE_KEYS.USER_DATA,
          ]);
        }
      }
    }
    return Promise.reject(error);
  },
);

export const authService = {
  login: async (phone: string, otp: string): Promise<ApiResponse<{user: User; token: string}>> => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {phone, otp});
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    }
  },

  register: async (userData: {
    name: string;
    phone: string;
    email?: string;
  }): Promise<ApiResponse<{user: User; token: string}>> => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
      };
    }
  },

  sendOTP: async (phone: string): Promise<ApiResponse<{message: string}>> => {
    try {
      const response = await api.post('/auth/send-otp', {phone});
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to send OTP',
      };
    }
  },

  verifyOTP: async (phone: string, otp: string): Promise<ApiResponse<{message: string}>> => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.VERIFY_OTP, {phone, otp});
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'OTP verification failed',
      };
    }
  },

  refreshToken: async (): Promise<ApiResponse<{token: string}>> => {
    try {
      const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {refreshToken});
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Token refresh failed',
      };
    }
  },

  logout: async (): Promise<ApiResponse<{message: string}>> => {
    try {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT);
      return {
        success: true,
        data: {message: 'Logged out successfully'},
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Logout failed',
      };
    }
  },

  updateProfile: async (userData: Partial<User>): Promise<ApiResponse<User>> => {
    try {
      const response = await api.put(API_ENDPOINTS.USER.PROFILE, userData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Profile update failed',
      };
    }
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    try {
      const response = await api.get(API_ENDPOINTS.USER.PROFILE);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch profile',
      };
    }
  },
};
