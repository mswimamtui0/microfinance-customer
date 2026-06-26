import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import Loading from '../components/Common/Loading';
import { customerAPI } from '../api';
import toast from 'react-hot-toast';

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const customer = JSON.parse(localStorage.getItem('customer') || '{}');
        const response = await customerAPI.dashboard(customer.phone);
        setProfile(response.data.profile);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
      }
    };

    fetchProfile();
  }, []);

  if (!profile) return <Loading />;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">First Name</label>
                <p className="text-gray-900 font-medium">{profile.first_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Last Name</label>
                <p className="text-gray-900 font-medium">{profile.last_name}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Phone Number</label>
              <p className="text-gray-900 font-medium">{profile.phone}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Email</label>
              <p className="text-gray-900 font-medium">{profile.email || '-'}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Gender</label>
                <p className="text-gray-900 font-medium capitalize">{profile.gender === 'M' ? 'Male' : profile.gender === 'F' ? 'Female' : 'Other'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Age</label>
                <p className="text-gray-900 font-medium">{profile.age} years</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Region</label>
                <p className="text-gray-900 font-medium">{profile.region}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">District</label>
                <p className="text-gray-900 font-medium">{profile.district}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Occupation</label>
              <p className="text-gray-900 font-medium">{profile.occupation}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Monthly Income</label>
              <p className="text-gray-900 font-medium">TZS {Number(profile.monthly_income).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;