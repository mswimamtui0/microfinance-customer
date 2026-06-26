// src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api';
import toast from 'react-hot-toast';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    first_name: '',
    last_name: '',
    email: '',
    gender: 'M',
    date_of_birth: '',
    nida_number: '',
    region: '',
    district: '',
    occupation: '',
    monthly_income: '',
    password: '',
    confirm_password: '',
  });
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ============================================
  // 🔧 TEMPORARY: Bypass OTP - Auto-verify
  // Remove this after OTP is working
  // ============================================
  const sendOTP = async () => {
    if (!formData.phone) {
      toast.error('Please enter your phone number');
      return;
    }

    setLoading(true);
    try {
      // Try to send OTP (if backend supports it)
      try {
        const response = await authAPI.sendOTP({
          phone: formData.phone,
          purpose: 'registration'
        });
        if (response.data.message) {
          toast.success('OTP sent to your phone!');
          setOtpSent(true);
        }
      } catch (error) {
        // If OTP fails, auto-verify anyway for testing
        console.warn('⚠️ OTP send failed, auto-verifying for testing...');
        toast.error('⚠️ OTP service unavailable. Auto-verifying for testing.', {
          duration: 3000,
        });
        setOtpVerified(true);
        setStep(2);
        toast.success('Phone verified! (Testing mode)');
      }
    } catch (error) {
      toast.error('Failed to verify phone. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 🔧 TEMPORARY: Auto-verify OTP
  const verifyOTP = async () => {
    if (!otp) {
      toast.error('Please enter OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.verifyOTP({
        phone: formData.phone,
        otp_code: otp,
        purpose: 'registration'
      });
      if (response.data.verified) {
        toast.success('OTP verified!');
        setOtpVerified(true);
        setStep(2);
      }
    } catch (error) {
      // 🔧 TEMPORARY: Auto-verify if backend fails
      console.warn('⚠️ OTP verification failed, auto-verifying for testing...');
      toast.error('⚠️ OTP service unavailable. Auto-verifying for testing.', {
        duration: 3000,
      });
      setOtpVerified(true);
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // END OF TEMPORARY OTP BYPASS
  // ============================================

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (formData.password !== formData.confirm_password) {
    toast.error('Passwords do not match');
    return;
  }

  setLoading(true);
  try {
    const response = await authAPI.register(formData);
    console.log('✅ Registration response:', response.data);
    
    if (response.data.success || response.status === 201) {
      toast.success('Registration successful! 🎉');
      // ... redirect logic
    }
  } catch (error) {
    console.error('❌ Registration error:', error);
    
    if (error.response) {
      const data = error.response.data;
      console.log('🔴 Full Error Response:', data);
      
      // 🔥 Check if errors exist and display them
      if (data.errors) {
        // Loop through all validation errors
        const errorMessages = [];
        Object.keys(data.errors).forEach(field => {
          const messages = data.errors[field];
          if (Array.isArray(messages)) {
            messages.forEach(msg => {
              const errorMsg = `${field}: ${msg}`;
              errorMessages.push(errorMsg);
              toast.error(errorMsg);
            });
          } else if (typeof messages === 'string') {
            const errorMsg = `${field}: ${messages}`;
            errorMessages.push(errorMsg);
            toast.error(errorMsg);
          } else if (typeof messages === 'object') {
            // Handle nested errors
            Object.keys(messages).forEach(subField => {
              const subMessages = messages[subField];
              if (Array.isArray(subMessages)) {
                subMessages.forEach(msg => {
                  const errorMsg = `${field}.${subField}: ${msg}`;
                  errorMessages.push(errorMsg);
                  toast.error(errorMsg);
                });
              }
            });
          }
        });
        
        if (errorMessages.length === 0) {
          toast.error('Validation failed. Please check your inputs.');
        }
      } else if (data.error) {
        toast.error(data.error);
      } else if (data.message) {
        toast.error(data.message);
      } else if (data.detail) {
        toast.error(data.detail);
      } else {
        toast.error('Server error. Please check your inputs.');
      }
    } else if (error.request) {
      toast.error('Network error. Please check your internet connection.');
    } else {
      toast.error(error.message || 'Registration failed. Please try again.');
    }
  } finally {
    setLoading(false);
  }
};

  // 🔧 TEMPORARY: Skip OTP function (fixed - no toast.info)
  const skipOTP = () => {
    toast.success('⚠️ Skipping OTP verification (Testing mode)', {
      duration: 3000,
    });
    setOtpVerified(true);
    setStep(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
            <span className="text-white text-3xl font-bold">M</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="mt-2 text-gray-600">Register to access loans</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Steps Progress */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'}`}>1</div>
              <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
            </div>
            <div className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'}`}>2</div>
            </div>
          </div>

          {/* Step 1: Phone Verification */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Verify Your Phone</h3>
                {/* 🔧 TEMPORARY: Skip OTP button */}
                <button
                  type="button"
                  onClick={skipOTP}
                  className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full hover:bg-yellow-200 transition-colors"
                >
                  ⚡ Skip OTP (Testing)
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0712345678"
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {otpSent ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
                  <div className="mt-1 flex gap-2">
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="123456"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={sendOTP}
                      className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700"
                    >
                      Resend
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={sendOTP}
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
              )}

              {otpSent && !otpVerified && (
                <button
                  type="button"
                  onClick={verifyOTP}
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
              )}

              {otpVerified && (
                <div className="text-center text-green-600 font-medium">
                  ✅ Phone verified successfully!
                </div>
              )}
            </div>
          )}

          {/* Step 2: Registration Form */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name *</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name *</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email (Optional)</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date of Birth *</label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">NIDA Number</label>
                <input
                  type="text"
                  name="nida_number"
                  value={formData.nida_number}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Region *</label>
                  <input
                    type="text"
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">District *</label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Occupation *</label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Monthly Income (TZS) *</label>
                <input
                  type="number"
                  name="monthly_income"
                  value={formData.monthly_income}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Create Password</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Password *</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={8}
                      className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Confirm Password *</label>
                    <input
                      type="password"
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50"
              >
                {loading ? 'Registering...' : 'Complete Registration'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;