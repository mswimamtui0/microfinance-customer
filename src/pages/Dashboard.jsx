// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerAPI } from '../api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const customer = JSON.parse(localStorage.getItem('customer') || '{}');
  const token = localStorage.getItem('customer_token');

  useEffect(() => {
    // Check if user is logged in
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch dashboard data
    const fetchDashboard = async () => {
      try {
        const response = await customerAPI.dashboard(customer.phone);
        setDashboardData(response.data);
        console.log('📊 Dashboard data:', response.data);
      } catch (error) {
        console.error('❌ Error fetching dashboard:', error);
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token, customer.phone, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
        
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500">Welcome back,</p>
            <p className="text-xl font-bold text-gray-900">
              {customer.first_name} {customer.last_name}
            </p>
            <p className="text-sm text-gray-500 mt-2">{customer.phone}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500">Total Loans</p>
            <p className="text-2xl font-bold text-primary-600">
              {dashboardData?.summary?.total_loans || 0}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500">Active Loans</p>
            <p className="text-2xl font-bold text-green-600">
              {dashboardData?.summary?.active_loans || 0}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500">Total Borrowed</p>
            <p className="text-2xl font-bold text-blue-600">
              TZS {dashboardData?.summary?.total_borrowed?.toLocaleString() || '0'}
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Loans</h2>
          {dashboardData?.recent_loans?.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.recent_loans.map((loan) => (
                <div key={loan.id} className="flex justify-between items-center border-b border-gray-100 py-2">
                  <div>
                    <p className="font-medium">{loan.loan_no}</p>
                    <p className="text-sm text-gray-500">Status: {loan.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">TZS {loan.principal?.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Due: {loan.maturity_date}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No loans yet. Apply for your first loan!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;