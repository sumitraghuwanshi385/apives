import axios from 'axios';

const API_URL = 'https://apives.onrender.com/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// 🔐 Attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem('mora_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user?.token) {
        if (config.headers?.set) {
          config.headers.set('Authorization', `Bearer ${user.token}`);
        } else {
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
  // 🔹 Provider dashboard
  getMyApis: async () => {
    const res = await axiosInstance.get('/apis/mine');
    return res.data;
  },

  // 🔹 Auth
  register: async (data: any) => {
    const res = await axiosInstance.post('/auth/register', data);
    return res.data;
  },

  login: async (data: any) => {
    const res = await axiosInstance.post('/auth/login', data);
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

  // 🔹 APIs
  createApi: async (apiData: any) => {
    const res = await axiosInstance.post('/apis/create', apiData);
    return res.data;
  },

  getAllApis: async () => {
    const res = await axiosInstance.get('/apis');
    return res.data;
  },

  // ✅ ✅ ✅ THIS WAS MISSING / BROKEN
  deleteApi: async (id: string) => {
    const res = await axiosInstance.delete(`/apis/${id}`);
    return res.data;
  },
};