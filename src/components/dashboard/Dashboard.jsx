import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StatCard from './statCard';
import CategoryTable from './CategoryTable';
import RecentActivity from './RecentActivity';
import TrendsChart from './TrendsCard';
import { dashboardService } from '../services/dashboardService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await dashboardService.getDashboardData();
      
      // Handle different response structures
      if (response && response.data) {
        setDashboardData(response.data);
      } else if (response) {
        setDashboardData(response);
      } else {
        setDashboardData(null);
      }
    } catch (error) {
      console.error('Dashboard error:', error);
      setError(error.message);
      toast.error(`Failed to load dashboard: ${error.message}`);
      
      setDashboardData({
        totals: {
          totalIncome: 0,
          totalExpenses: 0,
          netBalance: 0
        },
        categoryTotals: [],
        trends: [],
        yearlyTrends: [],
        recentActivity: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <h2 className="text-red-800 font-semibold mb-2">Unable to Load Dashboard</h2>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchDashboardData}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const role = user?.role || 'viewer';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          {role === 'admin' ? 'Admin Dashboard' : role === 'viewer' ? 'Viewer Dashboard' : 'Analyst Dashboard'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {user?.name || 'User'}! Role: {role.toUpperCase()}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Income"
          amount={`$${dashboardData?.totals?.totalIncome?.toLocaleString() || 0}`}
          type="income"
        />
        <StatCard
          title="Total Expenses"
          amount={`$${dashboardData?.totals?.totalExpenses?.toLocaleString() || 0}`}
          type="expense"
        />
        <StatCard
          title="Net Balance"
          amount={`$${dashboardData?.totals?.netBalance?.toLocaleString() || 0}`}
          type="balance"
        />
      </div>

      {role === 'admin' && (
        <div className="bg-white shadow rounded-lg p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Admin Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/transactions"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Manage Transactions
            </Link>
            <Link
              to="/admin/users"
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Manage Users
            </Link>
          </div>
        </div>
      )}

      {role !== 'viewer' && dashboardData?.categoryTotals?.length > 0 && (
        <CategoryTable categories={dashboardData.categoryTotals} />
      )}

      {dashboardData?.trends?.length > 0 && (
        <TrendsChart trends={dashboardData.trends} yearlyTrends={dashboardData.yearlyTrends} />
      )}

      {role === 'viewer' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          Viewer access: you can view dashboard and transactions. For user management and full controls, login as admin.
        </div>
      )}

      {(role === 'analyst' || role === 'admin') && dashboardData?.recentActivity?.length > 0 && (
        <RecentActivity activities={dashboardData.recentActivity} />
      )}
    </div>
  );
};

export default Dashboard;