// src/pages/ApplyLoan.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerAPI, productAPI } from '../api';
import toast from 'react-hot-toast';

const ApplyLoan = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]); // ✅ Initialize as empty array
  const [calculation, setCalculation] = useState(null);
  
  const [formData, setFormData] = useState({
    product: '',
    amount: '',
    term_months: '12',
    purpose: '',
    business_description: '',
    monthly_income: '',
    monthly_expenses: '',
    existing_loans: '0',
    guarantor_name: '',
    guarantor_phone: '',
    guarantor_relationship: '',
    guarantor_nida: '',
  });

  // Fetch loan products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAll();
      console.log('Products:', response.data);
      
      // ✅ Make sure we set an array
      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else if (response.data && Array.isArray(response.data.results)) {
        setProducts(response.data.results);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load loan products');
      setProducts([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Auto-calculate when amount or term changes
    if (name === 'amount' || name === 'term_months' || name === 'product') {
      calculateLoan();
    }
  };

  const calculateLoan = async () => {
    const { product, amount, term_months } = formData;
    
    if (!product || !amount || !term_months) {
      setCalculation(null);
      return;
    }

    try {
      const response = await customerAPI.loanCalculator({
        product_id: product,
        amount: amount,
        term: term_months
      });
      
      console.log('Calculation result:', response.data);
      setCalculation(response.data);
    } catch (error) {
      console.error('Calculation error:', error);
      setCalculation(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.product || !formData.amount || !formData.term_months) {
      toast.error('Please select product, amount and term');
      return;
    }

    setLoading(true);
    try {
      const customer = JSON.parse(localStorage.getItem('customer'));
      const phone = customer?.phone;
      
      const submitData = {
        ...formData,
        monthly_income: formData.monthly_income || '0',
        monthly_expenses: formData.monthly_expenses || '0',
        existing_loans: formData.existing_loans || '0',
      };
      
      const response = await customerAPI.applyLoan(submitData);
      console.log('Application response:', response.data);
      
      toast.success('Loan application submitted successfully!');
      setTimeout(() => navigate('/applications'), 2000);
      
    } catch (error) {
      console.error('Application error:', error);
      toast.error(error.response?.data?.error || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Apply for Loan</h1>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Loan Application Form */}
          <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loan Product *
                </label>
                <select
                  name="product"
                  value={formData.product}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select a product</option>
                  {Array.isArray(products) && products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.product_name || product.name} - {product.interest_rate || 0}% APR
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount and Term */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (TZS) *
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="500000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Term (Months) *
                  </label>
                  <select
                    name="term_months"
                    value={formData.term_months}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  > 
                    <option value="6">1 week</option>
                    <option value="6">1 months</option>
                    <option value="12">3 months</option>
                    <option value="18">6 months</option>
                    <option value="24">9 months</option>
                    <option value="36">12 months</option>
                    <option value="48">24 months</option>
                  </select>
                </div>
              </div>

              {/* Purpose */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loan Purpose *
                </label>
                <select
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select purpose</option>
                  <option value="business">Business Expansion</option>
                  <option value="education">Education</option>
                  <option value="medical">Medical Expenses</option>
                  <option value="home">Home Improvement</option>
                  <option value="vehicle">Vehicle Purchase</option>
                  <option value="agriculture">Agriculture</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="business_description"
                  value={formData.business_description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Brief description of what you need the loan for..."
                />
              </div>

              {/* Financial Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Income (TZS)
                  </label>
                  <input
                    type="number"
                    name="monthly_income"
                    value={formData.monthly_income}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Expenses (TZS)
                  </label>
                  <input
                    type="number"
                    name="monthly_expenses"
                    value={formData.monthly_expenses}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Guarantor Info */}
              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold text-gray-700 mb-3">Guarantor Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="guarantor_name"
                      value={formData.guarantor_name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="guarantor_phone"
                      value={formData.guarantor_phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Relationship
                    </label>
                    <select
                      name="guarantor_relationship"
                      value={formData.guarantor_relationship}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select relationship</option>
                      <option value="spouse">Spouse</option>
                      <option value="parent">Parent</option>
                      <option value="sibling">Sibling</option>
                      <option value="friend">Friend</option>
                      <option value="colleague">Colleague</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      NIDA Number
                    </label>
                    <input
                      type="text"
                      name="guarantor_nida"
                      value={formData.guarantor_nida}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>

          {/* Calculation Panel */}
          <div className="bg-white rounded-lg shadow p-6 h-fit sticky top-6">
            <h3 className="font-semibold text-gray-700 mb-4">Loan Summary</h3>
            
            {calculation ? (
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Principal Amount</p>
                  <p className="text-xl font-bold text-gray-900">
                    TZS {parseFloat(calculation.principal || 0).toLocaleString()}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Monthly Payment</p>
                  <p className="text-xl font-bold text-primary-600">
                    TZS {parseFloat(calculation.monthly_payment || 0).toLocaleString()}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600">Interest Rate</p>
                    <p className="font-bold text-gray-900">{calculation.interest_rate || 0}%</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600">Term</p>
                    <p className="font-bold text-gray-900">{calculation.term_months || 0} months</p>
                  </div>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Interest</span>
                    <span className="font-bold text-gray-900">
                      TZS {parseFloat(calculation.total_interest || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-gray-600">Total Payable</span>
                    <span className="font-bold text-primary-600 text-lg">
                      TZS {parseFloat(calculation.total_payable || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">
                  Fill in the loan details<br/>
                  to see the summary
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyLoan;