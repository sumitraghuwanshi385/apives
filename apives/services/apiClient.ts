import axios from 'axios';

const API_URL = 'https://apives.onrender.com/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// 🔐 Attach token

// 🔐 Attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem('mora_user');

    if (userStr) {
      const user = JSON.parse(userStr);

      const token =
        user?.token ||
        user?.accessToken ||
        user?.jwt ||
        null;

      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
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

// 🔹 Get single API by ID (for details page)
getApiById: async (id: string) => {
  const res = await axiosInstance.get(`/apis/${id}`);
  return res.data;
},

// ✏️ UPDATE API (EDIT)
  updateApi: async (id: string, apiData: any) => {
    const res = await axiosInstance.put(`/apis/${id}`, apiData);
    return res.data;
  },

// ⏸️ UPDATE API STATUS (Pause / Resume)
updateApiStatus: async (id: string, status: 'active' | 'paused') => {
  const res = await axiosInstance.put(`/apis/${id}`, { status });
  return res.data;
},

// ❤️ LIKE API
  likeApi: async (id: string) => {
    const res = await axiosInstance.post(`/apis/${id}/like`);
    return res.data;
  },

  // 💔 UNLIKE API
  unlikeApi: async (id: string) => {
    const res = await axiosInstance.post(`/apis/${id}/unlike`);
    return res.data;
  },

  // ✅ ✅ ✅ THIS WAS MISSING / BROKEN
  deleteApi: async (id: string) => {
    const res = await axiosInstance.delete(`/apis/${id}`);
    return res.data;
  },

// ✅ ADMIN VERIFY / UNVERIFY
toggleVerify: async (id: string) => {
  try {
    const res = await axiosInstance.patch(`/apis/${id}/verify`);
    return res.data;
  } catch (err: any) {
    alert(err?.response?.data?.message || "Unknown error");
    throw err;
  }
},

// ===============================
// 🔥 USECASE (Chatbots, Payments, etc.)
// ===============================

// GET usecase by slug
getUsecaseBySlug: async (slug: string) => {
  const res = await axiosInstance.get(`/usecases/${slug}`);
  return res.data;
},

updateUsecase: async (
  slug: string,
  data: {
    operationalInsight: string;
    curatedApiIds: string[];
  }
) => {
  const res = await axiosInstance.put(`/usecases/${slug}`, data);
  return res.data;
},
};