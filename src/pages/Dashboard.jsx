import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Loading from '../components/Common/Loading';
import { formatCurrency, formatDate } from '../utils/formatters';
import { customerAPI } from '../api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const customer = JSON.parse(localStorage.getItem('customer') || '{}');
        const response = await customerAPI.dashboard(customer.phone);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard:', error);
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <Loading />;

  const profile = data?.profile || {};
  const summary = data?.summary || {};

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-600 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
          <h1 className="text-2xl font-bold">
            Welcome back, {profile.first_name || 'Customer'}!
          </h1>
          <p className="text-primary-100 mt-1">Customer Portal • {profile.phone}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <p className="text-sm text-gray-500">Total Loans</p>
            <p className="text-2xl font-bold text-gray-900">{summary.total_loans || 0}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <p className="text-sm text-gray-500">Active Loans</p>
            <p className="text-2xl font-bold text-green-600">{summary.active_loans || 0}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <p className="text-sm text-gray-500">Total Borrowed</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.total_borrowed)}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <p className="text-sm text-gray-500">Next Payment</p>
            <p className="text-lg font-bold text-primary-600">
              {summary.next_payment ? formatDate(summary.next_payment) : '-'}
            </p>
            {summary.next_payment_amount && (
              <p className="text-sm text-gray-500">{formatCurrency(summary.next_payment_amount)}</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            to="/apply-loan"
            className="flex flex-col items-center p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
          >
            <span className="text-3xl mb-2">💰</span>
            <span className="text-sm font-medium text-gray-700">Apply for Loan</span>
          </Link>
          <Link
            to="/loans"
            className="flex flex-col items-center p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
          >
            <span className="text-3xl mb-2">📋</span>
            <span className="text-sm font-medium text-gray-700">My Loans</span>
          </Link>
          <Link
            to="/payments"
            className="flex flex-col items-center p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
          >
            <span className="text-3xl mb-2">💳</span>
            <span className="text-sm font-medium text-gray-700">Payments</span>
          </Link>
          <Link
            to="/profile"
            className="flex flex-col items-center p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
          >
            <span className="text-3xl mb-2">👤</span>
            <span className="text-sm font-medium text-gray-700">Profile</span>
          </Link>
        </div>

        {/* Recent Loans */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Loans</h3>
            <Link to="/loans" className="text-sm text-primary-600 hover:text-primary-700">
              View All →
            </Link>
          </div>
          <div className="text-center py-8 text-gray-500">
            No loans yet. Apply for your first loan today!
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;