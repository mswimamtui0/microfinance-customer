// src/api/index.js
import axios from 'axios';

// ✅ Use Render backend URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

console.log('🔗 API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('customer_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('📤 API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses
api.interceptors.response.use(
  (response) => {
    console.log('📥 API Response:', response.status, response.data);
    return response;
  },
  async (error) => {
    console.error('❌ API Error:', error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      localStorage.removeItem('customer_token');
      localStorage.removeItem('customer');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================
// AUTH API
// ============================================
export const authAPI = {
  register: (data) => {
    console.log('📝 Registering customer:', data);
    return api.post('/customer/auth/register/', data);
  },
  login: (credentials) => {
    console.log('🔐 Customer login:', credentials);
    return api.post('/customer/auth/login/', credentials);
  },
  sendOTP: (data) => {
    console.log('📱 Sending OTP:', data);
    return api.post('/customer/auth/send_otp/', data);
  },
  verifyOTP: (data) => {
    console.log('✅ Verifying OTP:', data);
    return api.post('/customer/auth/verify_otp/', data);
  },
  getBranches: () => {
    console.log('🏢 Fetching branches');
    return api.get('/branches/');
  },
};

export default api;