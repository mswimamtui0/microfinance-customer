import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { customerAPI } from '../api';
import toast from 'react-hot-toast';

const MyLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const customer = JSON.parse(localStorage.getItem('customer') || '{}');

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await customerAPI.getLoans(customer.phone);
        setLoans(response.data);
      } catch (error) {
        toast.error('Failed to load loans');
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, [customer.phone]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Loans</h1>
        {loans.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No loans yet.</p>
            <Link to="/apply-loan" className="inline-block mt-4 bg-primary-600 text-white px-6 py-2 rounded-lg">Apply Now</Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loan No.</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Maturity</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => (
                  <tr key={loan.id} className="border-b">
                    <td className="px-6 py-4">{loan.loan_no}</td>
                    <td className="px-6 py-4">TZS {loan.principal?.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        loan.status === 'active' ? 'bg-green-100 text-green-800' :
                        loan.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100'
                      }`}>{loan.status}</span>
                    </td>
                    <td className="px-6 py-4">{loan.maturity_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLoans;