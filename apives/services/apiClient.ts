import axios from 'axios';

// Backend ka URL (Make sure backend server port 5000 par chal raha ho)
const API_URL = 'https://apives.onrender.com/api';

// 1. Axios Instance Create karo
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Request Interceptor (Ye har request ke saath Token attach karega)
axiosInstance.interceptors.request.use((config) => {
  // LocalStorage se user data nikalo
  const userStr = localStorage.getItem('mora_user');
  
  if (userStr) {
    const user = JSON.parse(userStr);
    // Agar token available hai, to headers mein jod do
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 3. API Functions Export karo
export const apiService = {
  
  // --- AUTHENTICATION ---
  
  // Signup
  register: async (userData: any) => {
    // Backend path: /api/auth/register
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  },

  // Login
  login: async (credentials: any) => {
    // Backend path: /api/auth/login
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },

  // --- API LISTINGS ---

  // Create New API (Protected Route)
  createApi: async (apiData: any) => {
    // Backend path: /api/apis/create
    const response = await axiosInstance.post('/apis/create', apiData);
    return response.data;
  },

  // Get All APIs (Public Route)
  getAllApis: async () => {
    // Backend path: /api/apis
    const response = await axiosInstance.get('/apis');
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
};

