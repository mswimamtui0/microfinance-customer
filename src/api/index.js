import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
console.log('🔗 API URL:', process.env.REACT_APP_API_URL || 'http://localhost:8000/api');

console.log('🔗 Customer Portal API URL:', API_URL);

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
// AUTH API - Customer Portal
// ============================================
export const authAPI = {
  register: (data) => {
    console.log('📝 Registering customer:', data);
    return api.post('/customer/auth/register/', data);
  },
 
  login: (credentials) => {
    console.log('🔐 Login attempt:', credentials);
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
  profile: (phone) => {
    console.log('👤 Getting profile for:', phone);
    return api.get('/customer/profile/', { params: { phone } });
  },
  updateProfile: (data) => {
    console.log('✏️ Updating profile:', data);
    return api.put('/customer/update_profile/', data);
  },
  changePassword: (data) => {
    console.log('🔑 Changing password');
    return api.post('/customer/change_password/', data);
  },
  forgotPassword: (data) => {
    console.log('🔐 Forgot password for:', data);
    return api.post('/customer/forgot_password/', data);
  },
  resetPassword: (data) => {
    console.log('🔄 Resetting password');
    return api.post('/customer/reset_password/', data);
  },
};

// ============================================
// CUSTOMER API
// ============================================
export const customerAPI = {
  dashboard: (phone) => {
    console.log('📊 Getting dashboard for:', phone);
    return api.get('/customer/dashboard/', { params: { phone } });
  },
  applyLoan: (data) => {
    console.log('💰 Applying for loan:', data);
    return api.post('/customer/apply_loan/', data);
  },
  getLoans: (phone) => {
    console.log('📋 Getting loans for:', phone);
    return api.get('/customer/loans/', { params: { phone } });
  },
  getLoanDetail: (id, phone) => {
    console.log('📋 Getting loan detail:', id);
    return api.get(`/customer/loan_detail/${id}/`, { params: { phone } });
  },
  getPayments: (phone) => {
    console.log('💳 Getting payments for:', phone);
    return api.get('/customer/payment_history/', { params: { phone } });
  },
  getApplications: (phone) => {
    console.log('📋 Getting applications for:', phone);
    return api.get('/customer/applications/', { params: { phone } });
  },
  trackApplication: (id, phone) => {
    console.log('📋 Tracking application:', id);
    return api.get(`/customer/track_application/${id}/`, { params: { phone } });
  },
  loanCalculator: (params) => {
    console.log('🧮 Calculating loan:', params);
    return api.get('/customer/loan_calculator/', { params });
  },
  getGuarantors: (phone) => {
    console.log('👨‍👩‍👦 Getting guarantors for:', phone);
    return api.get('/customer/guarantors/', { params: { phone } });
  },
  addGuarantor: (data) => {
    console.log('➕ Adding guarantor:', data);
    return api.post('/customer/add_guarantor/', data);
  },
};

// ============================================
// LOAN PRODUCTS API
// ============================================
export const productAPI = {
  getAll: (params) => {
    console.log('📦 Getting loan products');
    return api.get('/loan-products/', { params });
  },
  getById: (id) => {
    console.log('📦 Getting product:', id);
    return api.get(`/loan-products/${id}/`);
  },
};

export default api;