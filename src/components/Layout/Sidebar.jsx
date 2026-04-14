import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  HomeIcon, 
  CurrencyDollarIcon, 
  UserGroupIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const dashboardHref =
    user?.role === 'admin'
      ? '/dashboard/admin'
      : user?.role === 'analyst'
      ? '/dashboard/analyst'
      : '/dashboard/viewer';

  const navigation = [
    { name: 'Dashboard', href: dashboardHref, icon: HomeIcon, roles: ['viewer', 'analyst', 'admin'] },
    { name: 'Transactions', href: '/transactions', icon: CurrencyDollarIcon, roles: ['viewer', 'analyst', 'admin'] },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon, roles: ['analyst', 'admin'] },
    { name: 'User Management', href: '/admin/users', icon: UserGroupIcon, roles: ['admin'] },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <div className="flex flex-col w-64 bg-gradient-to-b from-indigo-600 to-purple-600">
      <div className="flex items-center justify-center h-16 px-4 bg-indigo-700">
        <h1 className="text-white text-xl font-bold">Finance Manager</h1>
      </div>
      
      <div className="px-4 py-2">
        <div className="bg-indigo-700 rounded-lg p-3 mb-4">
          <p className="text-indigo-200 text-sm">Logged in as</p>
          <p className="text-white font-semibold">{user?.name}</p>
          <span className="inline-block px-2 py-1 mt-1 text-xs font-semibold text-indigo-600 bg-indigo-100 rounded-full">
            {user?.role}
          </span>
        </div>
      </div>

      <nav className="flex-1 px-2 space-y-1">
        {navigation.map((item) => {
          if (!item.roles.includes(user?.role)) return null;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive(item.href)
                  ? 'bg-indigo-700 text-white'
                  : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-indigo-500">
        <button
          onClick={logout}
          className="flex items-center w-full px-2 py-2 text-sm font-medium text-indigo-100 rounded-md hover:bg-indigo-700 hover:text-white"
        >
          <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;