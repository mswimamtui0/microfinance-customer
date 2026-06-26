// src/pages/LoanDetail.jsx
import React from 'react';
import { useParams } from 'react-router-dom';

const LoanDetail = () => {
  const { id } = useParams();
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Loan Details</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p>Loan #{id} details coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default LoanDetail;