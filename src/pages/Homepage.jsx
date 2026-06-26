// src/pages/Homepage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import heroBg from '../assets/images/boss.jpg';

// Import feature images
import secureImage from '../assets/images/boss.jpg';
import fastApprovalImage from '../assets/images/mama2.jpg';
import flexibleTermsImage from '../assets/images/mama2.jpg';
import noHiddenFeesImage from '../assets/images/boss.jpg';
import trackGrowthImage from '../assets/images/mama1.jpg';
import multipleProductsImage from '../assets/images/mama2.jpg';

const Homepage = () => {
  const features = [
    {
      image: secureImage,
      title: 'Secure & Safe',
      description: 'Your data and transactions are protected with industry-standard encryption.'
    },
    {
      image: fastApprovalImage,
      title: 'Fast Approval',
      description: 'Get loan decisions within minutes with our AI-powered system.'
    },
    {
      image: flexibleTermsImage,
      title: 'Flexible Terms',
      description: 'Choose repayment plans that suit your needs with competitive rates.'
    },
    {
      image: noHiddenFeesImage,
      title: 'No Hidden Fees',
      description: 'Transparent pricing with no hidden charges. What you see is what you get.'
    },
    {
      image: trackGrowthImage,
      title: 'Track Your Growth',
      description: 'Monitor your loans, payments, and financial health in real-time.'
    },
    {
      image: multipleProductsImage,
      title: 'Multiple Products',
      description: 'Access various loan products designed for personal and business needs.'
    }
  ];

  // Loan Products - No Icons
  const loanProducts = [
    {
      name: 'Personal Loan',
      amount: 'Up to 10M TZS',
      rate: '12% - 18% APR',
      term: '6 - 24 months',
      description: 'For personal expenses, education, home improvement, and more.',
      gradient: 'from-blue-500 to-blue-700',
      color: 'text-blue-600',
      bgLight: 'bg-blue-50',
      border: 'border-blue-200',
      accent: 'bg-blue-500'
    },
    {
      name: 'Business Loan',
      amount: 'Up to 50M TZS',
      rate: '10% - 16% APR',
      term: '12 - 48 months',
      description: 'Grow your business with flexible working capital and investment loans.',
      gradient: 'from-purple-500 to-purple-700',
      color: 'text-purple-600',
      bgLight: 'bg-purple-50',
      border: 'border-purple-200',
      accent: 'bg-purple-500'
    },
    {
      name: 'Micro Loan',
      amount: 'Up to 2M TZS',
      rate: '8% - 14% APR',
      term: '3 - 12 months',
      description: 'Quick and easy small loans for immediate financial needs.',
      gradient: 'from-green-500 to-green-700',
      color: 'text-green-600',
      bgLight: 'bg-green-50',
      border: 'border-green-200',
      accent: 'bg-green-500'
    },
    {
      name: 'Group Loan',
      amount: 'Up to 25M TZS',
      rate: '9% - 15% APR',
      term: '12 - 36 months',
      description: 'Perfect for community groups, SMEs, and cooperative members.',
      gradient: 'from-orange-500 to-orange-700',
      color: 'text-orange-600',
      bgLight: 'bg-orange-50',
      border: 'border-orange-200',
      accent: 'bg-orange-500'
    }
  ];

  const stats = [
    { value: '10,000+', label: 'Happy Customers' },
    { value: '50B+', label: 'Total Disbursed' },
    { value: '95%', label: 'Approval Rate' },
    { value: '4.8', label: 'Customer Rating' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar />

      {/* Hero Section */}
      <section 
        className="relative py-20 overflow-hidden min-h-[600px] flex items-center"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Removed emoji/icon */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                Trusted by 10,000+ customers
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}>
                Your Financial <br />
                <span className="text-primary-300 relative">
                  Growth Partner
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary-400" viewBox="0 0 300 10" fill="currentColor">
                    <path d="M0,5 C30,10 70,0 100,5 C130,10 170,0 200,5 C230,10 270,0 300,5" />
                  </svg>
                </span>
              </h1>
              <p className="text-xl text-white mb-8 leading-relaxed" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.5)' }}>
                Access affordable loans, track your finances, and achieve your dreams with our reliable microfinance services.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="bg-primary-500 text-white px-8 py-3.5 rounded-lg font-medium hover:bg-primary-600 transition-all transform hover:scale-105 shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2">
                  Get Started Now
                </Link>
                <Link to="/about" className="bg-white/20 backdrop-blur-sm border-2 border-white text-white px-8 py-3.5 rounded-lg font-medium hover:bg-white/30 transition-colors text-center">
                  Learn More
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Quick Loan Calculator</h3>
                  <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">Pre-approved</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600 block mb-2">Loan Amount (TZS)</label>
                    <div className="bg-gray-100 rounded-lg p-3">
                      <span className="text-2xl font-bold text-gray-900">TZS 500,000</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600 block mb-2">Duration</label>
                      <div className="bg-gray-100 rounded-lg p-3 text-center">
                        <span className="font-semibold text-gray-900">6 months</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-2">Monthly Payment</label>
                      <div className="bg-primary-50 rounded-lg p-3 text-center">
                        <span className="font-bold text-primary-600">TZS 88,500</span>
                      </div>
                    </div>
                  </div>
                  <Link to="/register" className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors block text-center font-medium">
                    Apply Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - No Icons */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600">{stat.value}</div>
                <div className="text-gray-600 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - No Icons */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Why Choose Us</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
              Why Choose <span className="text-primary-600">M</span>Finance?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide fast, secure, and affordable financial solutions tailored to your needs.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100">
                <div className="mb-4 overflow-hidden rounded-xl w-16 h-16">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Loan Products Section - No Icons */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Our Products</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
              Loan <span className="text-primary-600">Products</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from a variety of loan products designed to meet your financial needs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loanProducts.map((product, index) => (
              <div 
                key={index} 
                className={`relative rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border ${product.border} ${product.bgLight} bg-white overflow-hidden group`}
              >
                {/* Top Accent Bar */}
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${product.gradient}`}></div>
                
                {/* Decorative Circle */}
                <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full ${product.bgLight} opacity-30 group-hover:scale-150 transition-transform duration-500`}></div>
                
                {/* Product Number instead of Icon */}
                <div className={`relative z-10 w-14 h-14 rounded-xl bg-gradient-to-r ${product.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <span className="text-white text-xl font-bold">{String(index + 1).padStart(2, '0')}</span>
                </div>
                
                <h3 className="relative z-10 text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                <p className={`relative z-10 text-2xl font-bold ${product.color} mb-3`}>{product.amount}</p>
                
                <div className="relative z-10 space-y-2 text-sm text-gray-600 mb-4">
                  <p className="flex items-center gap-2">
                    <span className={`inline-block w-2 h-2 rounded-full ${product.accent}`}></span>
                    Rate: {product.rate}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className={`inline-block w-2 h-2 rounded-full ${product.accent}`}></span>
                    Term: {product.term}
                  </p>
                  <p className="text-gray-700 mt-3 pt-3 border-t border-gray-200">{product.description}</p>
                </div>
                
                <Link 
                  to="/register" 
                  className={`relative z-10 inline-flex items-center ${product.color} font-medium hover:${product.color} group-hover:translate-x-1 transition-all duration-300`}
                >
                  Apply Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - No Icons */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Achieve Your Financial Goals?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of satisfied customers. Apply for a loan today and take the first step toward financial freedom.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-white text-primary-600 px-10 py-4 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-lg transform hover:scale-105">
              Get Started Now
            </Link>
            <Link to="/login" className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-lg font-medium hover:bg-white/10 transition-colors">
              Log In
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default Homepage;