// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { customerAPI } from '../api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const customer = JSON.parse(localStorage.getItem('customer') || '{}');
  const token = localStorage.getItem('customer_token');

  useEffect(() => {
    if (!token) {
      navigate('/dashboard');
      return;
    }

    if (!customer?.phone) {
      navigate('/dashboard');
      return;
    }

    const fetchDashboard = async () => {
      try {
        const response = await customerAPI.dashboard(customer.phone);
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard:', error);
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token, customer?.phone, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('customer_token');
    localStorage.removeItem('customer');
    navigate('/login');
  };

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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg min-h-screen p-4">
        <div className="flex items-center mb-8">
          <span className="text-2xl font-bold text-primary-600">M</span>
          <span className="text-2xl font-bold text-gray-900">Finance</span>
        </div>

        <nav className="space-y-2">
          <Link 
            to="/dashboard" 
            className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
          >
            📊 Dashboard
          </Link>
          <Link 
            to="/apply-loan" 
            className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
          >
            💰 Apply for Loan
          </Link>
          <Link 
            to="/loans" 
            className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
          >
            📋 My Loans
          </Link>
          <Link 
            to="/payments" 
            className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
          >
            💳 Payment History
          </Link>
          <Link 
            to="/applications" 
            className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
          >
            📌 Track Applications
          </Link>
          <Link 
            to="/profile" 
            className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
          >
            👤 My Profile
          </Link>

          <div className="border-t border-gray-200 my-4"></div>

          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            🚪 Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, <span className="font-semibold">{customer?.first_name || 'Customer'}!</span>
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
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
          
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500">Next Payment</p>
            <p className="text-2xl font-bold text-orange-600">
              {dashboardData?.summary?.next_payment || '-'}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Link to="/apply-loan" className="bg-primary-600 text-white p-4 rounded-lg text-center hover:bg-primary-700 transition-colors">
            <p className="font-semibold">Apply for Loan</p>
          </Link>
          <Link to="/loans" className="bg-gray-200 text-gray-800 p-4 rounded-lg text-center hover:bg-gray-300 transition-colors">
            <p className="font-semibold">My Loans</p>
          </Link>
          <Link to="/payments" className="bg-gray-200 text-gray-800 p-4 rounded-lg text-center hover:bg-gray-300 transition-colors">
            <p className="font-semibold">Payments</p>
          </Link>
          <Link to="/profile" className="bg-gray-200 text-gray-800 p-4 rounded-lg text-center hover:bg-gray-300 transition-colors">
            <p className="font-semibold">Profile</p>
          </Link>
        </div>

        {/* Recent Loans */}
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
            <p className="text-gray-500">No loans yet. Apply for your first loan today!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;