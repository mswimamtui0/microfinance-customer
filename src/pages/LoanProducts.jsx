// src/pages/LoanProducts.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';

const LoanProducts = () => {
  const products = [
    {
      name: 'Personal Loan in NEOVAM GROUP',
      amount: 'Up to 1M TZS',
      rate: '10% - 15% APR',
      term: '1 - 9 months',
      description: 'For personal expenses, education, home improvement, and more.',
      color: 'blue'
    },
    {
      name: 'Business Loan in NEOVAM GROUP',
      amount: 'Up to 5M TZS',
      rate: '15 - 20% APR',
      term: '1 - 12 months',
      description: 'Grow your business with flexible working capital and investment loans.',
      color: 'purple'
    },
    {
      name: 'Micro Loan in NEOVAM GROUP',
      amount: 'Up to 2M TZS',
      rate: '8% - 14% APR',
      term: '1 - 12 months',
      description: 'Quick and easy small loans for immediate financial needs.',
      color: 'green'
    },
    {
      name: 'Group Loan in NEOVAM GROUP',
      amount: 'Up to 10M TZS',
      rate: '9% - 15% APR',
      term: '6 - 24 months',
      description: 'Perfect for community groups, SMEs, and cooperative members.',
      color: 'orange'
    }
  ];

  const colorClasses = {
    blue: 'border-blue-500 bg-blue-50',
    purple: 'border-purple-500 bg-purple-50',
    green: 'border-green-500 bg-green-50',
    orange: 'border-orange-500 bg-orange-50'
  };

  const textColors = {
    blue: 'text-blue-600',
    purple: 'text-purple-600',
    green: 'text-green-600',
    orange: 'text-orange-600'
  };

  return (
    <>
      <PublicNavbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Loan Products</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from a variety of loan products designed to meet your financial needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <div 
                key={index}
                className={`border-t-4 ${colorClasses[product.color]} bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow`}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                <p className={`text-2xl font-bold ${textColors[product.color]} mb-3`}>
                  {product.amount}
                </p>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p>Rate: {product.rate}</p>
                  <p>Term: {product.term}</p>
                  <p className="text-gray-700 mt-3 pt-3 border-t border-gray-200">
                    {product.description}
                  </p>
                </div>
                <Link 
                  to="/register" 
                  className={`inline-block w-full text-center ${textColors[product.color]} font-medium border border-current rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors`}
                >
                  Apply Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      <PublicFooter />
    </>
  );
};

export default LoanProducts;