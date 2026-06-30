// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../api';
import toast from 'react-hot-toast';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      toast.error('Tafadhali ingiza nambari ya simu na nenosiri');
      return;
    }

    setLoading(true);
    try {
      console.log('🔐 Sending login request:', {
        username: formData.username,
        password: '********'
      });
      
      const response = await authAPI.login({
        username: formData.username,
        password: formData.password
      });
      
      console.log('📥 Full Login Response:', response);
      console.log('📥 Login response data:', response.data);
      
      // ✅ Check for successful login
      if (response.status === 200 || response.status === 201) {
        // Check if tokens exist in response
        if (response.data.tokens) {
          // Save tokens
          localStorage.setItem('customer_token', response.data.tokens.access);
          localStorage.setItem('refresh_token', response.data.tokens.refresh);
          console.log('✅ Tokens saved to localStorage');
        } else if (response.data.access) {
          // Alternative token format
          localStorage.setItem('customer_token', response.data.access);
          console.log('✅ Access token saved to localStorage');
        } else {
          console.warn('⚠️ No tokens found in response');
        }
        
        // Save customer data
        if (response.data.customer) {
          localStorage.setItem('customer', JSON.stringify(response.data.customer));
          console.log('✅ Customer data saved:', response.data.customer);
        } else if (response.data.user) {
          localStorage.setItem('customer', JSON.stringify(response.data.user));
        }
        
        toast.success('Karibu! 🎉');
        
        // Navigate to dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      } else {
        toast.error(response.data?.error || response.data?.message || 'Login failed');
      }
      
    } catch (error) {
      console.error('❌ Login error details:', error);
      
      // Handle different error cases
      if (error.response) {
        const data = error.response.data;
        console.log('📋 Error response status:', error.response.status);
        console.log('📋 Error response data:', data);
        
        // Check for specific error messages
        if (data.error) {
          toast.error(data.error);
        } else if (data.message) {
          toast.error(data.message);
        } else if (data.detail) {
          toast.error(data.detail);
        } else if (data.non_field_errors) {
          toast.error(data.non_field_errors[0]);
        } else if (error.response.status === 401) {
          toast.error('Nambari ya simu au nenosiri si sahihi');
        } else if (error.response.status === 403) {
          toast.error('Akaunti yako imezuiwa. Wasiliana na msaidizi.');
        } else if (error.response.status === 404) {
          toast.error('Akaunti haipatikani. Tafadhali jisajili.');
        } else {
          toast.error('Kuna hitilafu. Tafadhali jaribu tena.');
        }
      } else if (error.request) {
        console.error('No response from server:', error.request);
        toast.error('Hitilafu ya mtandao. Tafadhali angalia muunganisho wako.');
      } else {
        console.error('Error setting up request:', error.message);
        toast.error('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
            <span className="text-white text-3xl font-bold">M</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Karibu Tena</h2>
          <p className="mt-2 text-gray-600">Ingia kwenye akaunti yako</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nambari ya Simu
            </label>
            <input
              type="tel"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="0712345678"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nenosiri
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50"
          >
            {loading ? 'Inaingiza...' : 'Ingia'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Huna akaunti?{' '}
          <Link to="/register" className="text-primary-600 font-medium hover:underline">
            Jisajili
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;