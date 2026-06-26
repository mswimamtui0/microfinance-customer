import React from 'react';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';

const Contact = () => {
  return (
    <>
      <PublicNavbar />
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
          <div className="bg-white rounded-lg shadow p-6">
            <p>Contact page coming soon...</p>
          </div>
        </div>
      </div>
      <PublicFooter />
    </>
  );
};

export default Contact;