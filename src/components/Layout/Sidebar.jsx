import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Apply for Loan', href: '/apply-loan' },
    { name: 'My Loans', href: '/loans' },
    { name: 'Payment History', href: '/payments' },
    { name: 'Track Applications', href: '/applications' },
    { name: 'My Profile', href: '/profile' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full shadow-sm">
      <nav className="mt-5 px-2 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;