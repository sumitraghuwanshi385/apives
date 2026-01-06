import axios from 'axios';
console.log("✅ apiClient LIVE VERSION: getMyApis present");

const API_URL = 'https://apives.onrender.com/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem('mora_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user?.token) {
        // Axios v1: headers object supports .set()
        config.headers?.set?.('Authorization', `Bearer ${user.token}`);
        if (!config.headers?.set) {
          (config.headers as any) = {
            ...(config.headers as any),
            Authorization: `Bearer ${user.token}`,
          };
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const apiService = {
  // ✅ Provider dashboard
  getMyApis: async () => {
    const response = await axiosInstance.get('/apis/mine');
    return response.data;
  },

  // Auth
  register: async (userData: any) => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials: any) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await axiosInstance.post('/auth/forgot-password', { email });
    return response.data;
  },

  verifyOtp: async (email: string, otp: string) => {
    const response = await axiosInstance.post('/auth/verify-otp', { email, otp });
    return response.data;
  },

  resetPassword: async (email: string, otp: string, password: string) => {
    const response = await axiosInstance.post('/auth/reset-password', { email, otp, password });
    return response.data;
  },

  // APIs
  createApi: async (apiData: any) => {
    const response = await axiosInstance.post('/apis/create', apiData);
    return response.data;
  },

  getAllApis: async () => {
    const response = await axiosInstance.get('/apis');
    return response.data;
  },
};