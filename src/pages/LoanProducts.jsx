import React from 'react';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';

const LoanProducts = () => {
  return (
    <>
      <PublicNavbar />
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Loan Products</h1>
          <div className="bg-white rounded-lg shadow p-6">
            <p>Loan products coming soon...</p>
          </div>
        </div>
      </div>
      <PublicFooter />
    </>
  );
};

export default LoanProducts;