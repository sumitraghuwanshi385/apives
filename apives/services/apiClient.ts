import axios from 'axios';

console.log("✅ apiClient LIVE VERSION");

const API_URL = 'https://apives.onrender.com/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔐 Token interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem('mora_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user?.token) {
        config.headers = {
          ...(config.headers || {}),
          Authorization: `Bearer ${user.token}`,
        };
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🚀 ALL BACKEND CALLS
export const apiService = {
  // ===== AUTH =====
  register: async (userData: any) => {
    const res = await axiosInstance.post('/auth/register', userData);
    return res.data;
  },

  login: async (credentials: any) => {
    const res = await axiosInstance.post('/auth/login', credentials);
    return res.data;
  },

  forgotPassword: async (email: string) => {
    const res = await axiosInstance.post('/auth/forgot-password', { email });
    return res.data;
  },

  verifyOtp: async (email: string, otp: string) => {
    const res = await axiosInstance.post('/auth/verify-otp', { email, otp });
    return res.data;
  },

  resetPassword: async (email: string, otp: string, password: string) => {
    const res = await axiosInstance.post('/auth/reset-password', {
      email,
      otp,
      password,
    });
    return res.data;
  },

  // ===== APIs =====
  createApi: async (apiData: any) => {
    const res = await axiosInstance.post('/apis/create', apiData);
    return res.data;
  },

  getMyApis: async () => {
    const res = await axiosInstance.get('/apis/mine');
    return res.data;
  },

  getAllApis: async () => {
    const res = await axiosInstance.get('/apis');
    return res.data;
  },

  // ✅🔥 DELETE API (MOST IMPORTANT)
  deleteApi: async (id: string) => {
    const res = await axiosInstance.delete(`/apis/${id}`);
    return res.data;
  },
};

// (Optional helper – safe to keep)
export const normalizeApi = (a: any) => ({
  ...a,
  id: a?._id || a?.id,
  publishedAt: a?.publishedAt || a?.createdAt || new Date().toISOString(),
});