import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import Loading from '../components/Common/Loading';
import { formatDate, getStatusColor } from '../utils/formatters';
import { customerAPI } from '../api';
import toast from 'react-hot-toast';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await customerAPI.getApplications();
        setApplications(response.data);
      } catch (error) {
        console.error('Error fetching applications:', error);
        toast.error('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) return <Loading />;

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Track Applications</h1>

        {applications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500">No applications found.</p>
            <p className="text-sm text-gray-400 mt-2">Apply for a loan to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{app.product_name}</h3>
                    <p className="text-sm text-gray-600">Amount: TZS {Number(app.amount).toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Term: {app.term_months} months</p>
                    <p className="text-sm text-gray-500">Submitted: {formatDate(app.submitted_at)}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">Application #{app.id}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Applications;