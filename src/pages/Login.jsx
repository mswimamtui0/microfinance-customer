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
      
      const response = await authAPI.login(formData);
      console.log('📥 Login response:', response.data);
      
      // Check if login was successful
      if (response.data.success === true || response.data.tokens) {
        // Save tokens
        if (response.data.tokens) {
          localStorage.setItem('customer_token', response.data.tokens.access);
          localStorage.setItem('refresh_token', response.data.tokens.refresh);
        }
        
        // Save customer data
        if (response.data.customer) {
          localStorage.setItem('customer', JSON.stringify(response.data.customer));
        }
        
        toast.success('Karibu! 🎉');
        
        // Navigate to dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      } else {
        toast.error(response.data.error || 'Login failed');
      }
      
    } catch (error) {
      console.error('❌ Login error:', error);
      
      // Handle different error cases
      if (error.response) {
        const data = error.response.data;
        console.log('📋 Error response:', data);
        
        if (data.error) {
          toast.error(data.error);
        } else if (data.message) {
          toast.error(data.message);
        } else if (data.detail) {
          toast.error(data.detail);
        } else if (data.non_field_errors) {
          toast.error(data.non_field_errors[0]);
        } else {
          toast.error('Nambari ya simu au nenosiri si sahihi');
        }
      } else if (error.request) {
        console.error('No response from server');
        toast.error('Hitilafu ya mtandao. Tafadhali angalia muunganisho wako.');
      } else {
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