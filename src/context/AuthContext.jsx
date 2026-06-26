import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('customer_token');
    const savedCustomer = localStorage.getItem('customer');
    if (token && savedCustomer) {
      setCustomer(JSON.parse(savedCustomer));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      if (response.data.success) {
        const { access, refresh } = response.data.tokens;
        localStorage.setItem('customer_token', access);
        localStorage.setItem('customer_refresh', refresh);
        localStorage.setItem('customer', JSON.stringify(response.data.customer));
        setCustomer(response.data.customer);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: 'Login failed' };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Login failed' };
    }
  };

  const register = async (data) => {
    try {
      const response = await authAPI.register(data);
      if (response.data.success) {
        return { success: true, data: response.data };
      }
      return { success: false, error: response.data.errors };
    } catch (error) {
      return { success: false, error: error.response?.data?.errors || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('customer_token');
    localStorage.removeItem('customer_refresh');
    localStorage.removeItem('customer');
    setCustomer(null);
    setIsAuthenticated(false);
  };

  const value = {
    customer,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};