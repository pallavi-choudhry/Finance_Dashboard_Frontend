import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';
import { backendPublicOrigin } from '../../config/apiConfig';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loginAs, setLoginAs] = useState('viewer');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const getDashboardPathByRole = (role) => {
    if (role === 'admin') return '/dashboard/admin';
    if (role === 'analyst') return '/dashboard/analyst';
    return '/dashboard/viewer';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loggedInUser = await login(formData.email, formData.password);
    setLoading(false);
    if (loggedInUser) {
      if (loginAs !== 'any' && loggedInUser.role !== loginAs) {
        authService.logout();
        toast.error(`This account is ${loggedInUser.role}. Please choose "${loggedInUser.role}" in Login As.`);
        return;
      }
      navigate(getDashboardPathByRole(loggedInUser.role));
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-600">
            <span className="text-white text-xl font-bold">$</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Finance Manager
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="loginAs" className="sr-only">
                Login As
              </label>
              <select
                id="loginAs"
                name="loginAs"
                value={loginAs}
                onChange={(e) => setLoginAs(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              >
                <option value="viewer">Login as Viewer</option>
                <option value="analyst">Login as Analyst</option>
                <option value="admin">Login as Admin</option>
                <option value="any">Auto (detect from account role)</option>
              </select>
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                Don't have an account? Register
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          {/* Demo credentials */}
          <div className="mt-4 text-center text-xs text-gray-500">
            <p>Demo Accounts:</p>
            <p>Admin: admin@example.com / Admin123!</p>
            <p>Viewer: viewer@example.com / viewer123</p>
            <p>Analyst: analyst@example.com / analyst123</p>
          </div>

          <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 text-left text-xs text-gray-600">
            <p className="font-semibold text-gray-800 mb-2">Live demo links</p>
            <ul className="space-y-1 break-all">
              <li>
                <span className="text-gray-500">Frontend (this app):</span>{' '}
                <a
                  href={typeof window !== 'undefined' ? window.location.origin : '#'}
                  className="text-indigo-600 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  {typeof window !== 'undefined' ? window.location.origin : '—'}
                </a>
              </li>
              <li>
                <span className="text-gray-500">Backend (API):</span>{' '}
                <a
                  href={backendPublicOrigin}
                  className="text-indigo-600 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  {backendPublicOrigin}
                </a>
                {' · '}
                <a
                  href={`${backendPublicOrigin}/api/test`}
                  className="text-indigo-600 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  /api/test
                </a>
              </li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;