// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendOTP = async () => {
    if (!formData.phone) {
      toast.error('Tafadhali ingiza nambari ya simu');
      return;
    }

    setLoading(true);
    try {
      try {
        const response = await authAPI.sendOTP({
          phone: formData.phone,
          purpose: 'registration'
        });
        if (response.data.message) {
          toast.success('OTP imetumwa kwenye simu yako!');
          setOtpSent(true);
        }
      } catch (error) {
        console.warn('⚠️ OTP send failed, auto-verifying for testing...');
        toast.error('⚠️ OTP service unavailable. Auto-verifying for testing.', {
          duration: 3000,
        });
        setOtpVerified(true);
        setStep(2);
        toast.success('Simu imethibitishwa! (Testing mode)');
      }
    } catch (error) {
      toast.error('Failed to verify phone. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp) {
      toast.error('Tafadhali ingiza OTP');
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
        toast.success('OTP imethibitishwa!');
        setOtpVerified(true);
        setStep(2);
      }
    } catch (error) {
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

  const skipOTP = () => {
    toast.success('⚠️ Skipping OTP verification (Testing mode)', {
      duration: 3000,
    });
    setOtpVerified(true);
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirm_password) {
      toast.error('Manenosiri hayafanani');
      return;
    }

    if (!formData.phone || !formData.first_name || !formData.last_name || !formData.password) {
      toast.error('Tafadhali jaza sehemu zote zinazohitajika');
      return;
    }

    setLoading(true);
    try {
      console.log('📝 Submitting registration:', formData);
      
      const response = await authAPI.register(formData);
      console.log('✅ Registration response:', response.data);
      
      if (response.data.success || response.status === 201) {
        toast.success('Usajili umefanikiwa! 🎉');
        
        // ✅ AUTO-LOGIN after registration
        try {
          const loginResponse = await authAPI.login({
            username: formData.phone,
            password: formData.password
          });
          
          console.log('✅ Auto-login response:', loginResponse.data);
          
          if (loginResponse.data.tokens) {
            // Save tokens
            localStorage.setItem('customer_token', loginResponse.data.tokens.access);
            localStorage.setItem('refresh_token', loginResponse.data.tokens.refresh);
            
            // Save customer data
            if (loginResponse.data.customer) {
              localStorage.setItem('customer', JSON.stringify(loginResponse.data.customer));
            }
            
            toast.success('Karibu! Unaelekezwa kwenye dashibodi...');
            
            // ✅ Redirect to dashboard immediately
            setTimeout(() => {
              navigate('/dashboard');
            }, 500);
          } else if (loginResponse.data.access) {
            localStorage.setItem('customer_token', loginResponse.data.access);
            toast.success('Karibu! Unaelekezwa kwenye dashibodi...');
            setTimeout(() => {
              navigate('/dashboard');
            }, 500);
          } else {
            // If auto-login fails, redirect to login page
            toast.info('Tafadhali ingia kwa akaunti yako');
            setTimeout(() => {
              navigate('/login');
            }, 1000);
          }
        } catch (loginError) {
          console.error('❌ Auto-login failed:', loginError);
          toast.info('Usajili umefanikiwa! Tafadhali ingia');
          setTimeout(() => {
            navigate('/login');
          }, 1000);
        }
      } else {
        // Show validation errors
        if (response.data.errors) {
          Object.keys(response.data.errors).forEach(key => {
            const messages = response.data.errors[key];
            if (Array.isArray(messages)) {
              messages.forEach(msg => toast.error(`${key}: ${msg}`));
            } else {
              toast.error(`${key}: ${messages}`);
            }
          });
        } else {
          toast.error('Usajili umeshindwa. Tafadhali jaribu tena.');
        }
      }
      
    } catch (error) {
      console.error('❌ Registration error:', error);
      
      if (error.response) {
        const data = error.response.data;
        if (data.errors) {
          Object.keys(data.errors).forEach(key => {
            const messages = data.errors[key];
            if (Array.isArray(messages)) {
              messages.forEach(msg => toast.error(`${key}: ${msg}`));
            } else {
              toast.error(`${key}: ${messages}`);
            }
          });
        } else if (data.error) {
          toast.error(data.error);
        } else if (data.message) {
          toast.error(data.message);
        } else {
          toast.error('Usajili umeshindwa. Tafadhali jaribu tena.');
        }
      } else if (error.request) {
        toast.error('Hitilafu ya mtandao. Tafadhali angalia muunganisho wako.');
      } else {
        toast.error('Usajili umeshindwa. Tafadhali jaribu tena.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
            <span className="text-white text-3xl font-bold">M</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Unda Akaunti</h2>
          <p className="mt-2 text-gray-600">Jisajili kupata mikopo</p>
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
                <h3 className="text-lg font-medium text-gray-900">Thibitisha Nambari yako</h3>
                <button
                  type="button"
                  onClick={skipOTP}
                  className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full hover:bg-yellow-200 transition-colors"
                >
                  ⚡ Ruka OTP (Testing)
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Nambari ya Simu</label>
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
                  <label className="block text-sm font-medium text-gray-700">Ingiza OTP</label>
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
                      Tuma Tena
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
                  {loading ? 'Inatuma...' : 'Tuma OTP'}
                </button>
              )}

              {otpSent && !otpVerified && (
                <button
                  type="button"
                  onClick={verifyOTP}
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Inathibitisha...' : 'Thibitisha OTP'}
                </button>
              )}

              {otpVerified && (
                <div className="text-center text-green-600 font-medium">
                  ✅ Nambari imethibitishwa!
                </div>
              )}
            </div>
          )}

          {/* Step 2: Registration Form */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Jina la Kwanza *</label>
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
                  <label className="block text-sm font-medium text-gray-700">Jina la Mwisho *</label>
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
                <label className="block text-sm font-medium text-gray-700">Barua pepe (Hiari)</label>
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
                  <label className="block text-sm font-medium text-gray-700">Jinsia</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="M">Me</option>
                    <option value="F">Ke</option>
                    <option value="O">Nyingine</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tarehe ya Kuzaliwa *</label>
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
                <label className="block text-sm font-medium text-gray-700">Namba ya NIDA</label>
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
                  <label className="block text-sm font-medium text-gray-700">Mkoa *</label>
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
                  <label className="block text-sm font-medium text-gray-700">Wilaya *</label>
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
                <label className="block text-sm font-medium text-gray-700">Kazi *</label>
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
                <label className="block text-sm font-medium text-gray-700">Mapato ya Mwezi (TZS) *</label>
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
                <h4 className="text-md font-medium text-gray-900 mb-4">Unda Nenosiri</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nenosiri *</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={8}
                      className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">Lazima iwe na herufi 8 au zaidi</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Thibitisha Nenosiri *</label>
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
                {loading ? 'Inasajili...' : 'Maliza Usajili'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;