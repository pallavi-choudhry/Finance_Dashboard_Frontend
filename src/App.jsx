import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './components/context/AuthContext';
import PrivateRoute from './components/Layout/PrivateRoutes';
import Sidebar from './components/Layout/Sidebar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import TransactionList from './components/Transactions/TransactionList';
import UserManagement from './components/Admin/UserManagement';
import { useAuth } from './components/context/AuthContext';

function RoleDashboardRedirect() {
  const { user } = useAuth();
  if (user?.role === 'admin') return <Navigate to="/dashboard/admin" replace />;
  if (user?.role === 'analyst') return <Navigate to="/dashboard/analyst" replace />;
  return <Navigate to="/dashboard/viewer" replace />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/*" element={
            <PrivateRoute>
              <div className="flex h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 overflow-auto">
                  <div className="p-8">
                    <Routes>
                      <Route path="/dashboard" element={<RoleDashboardRedirect />} />
                      <Route path="/dashboard/admin" element={
                        <PrivateRoute allowedRoles={['admin']}>
                          <Dashboard />
                        </PrivateRoute>
                      } />
                      <Route path="/dashboard/analyst" element={
                        <PrivateRoute allowedRoles={['analyst', 'admin']}>
                          <Dashboard />
                        </PrivateRoute>
                      } />
                      <Route path="/dashboard/viewer" element={
                        <PrivateRoute allowedRoles={['viewer', 'analyst', 'admin']}>
                          <Dashboard />
                        </PrivateRoute>
                      } />
                      <Route path="/dashboard/*" element={
                        <PrivateRoute allowedRoles={['viewer', 'analyst', 'admin']}>
                          <RoleDashboardRedirect />
                        </PrivateRoute>
                      } />
                      <Route path="/transactions" element={
                        <PrivateRoute allowedRoles={['viewer', 'analyst', 'admin']}>
                          <TransactionList />
                        </PrivateRoute>
                      } />
                      <Route path="/admin/users" element={
                        <PrivateRoute allowedRoles={['admin']}>
                          <UserManagement />
                        </PrivateRoute>
                      } />
                      <Route path="/" element={<RoleDashboardRedirect />} />
                    </Routes>
                  </div>
                </div>
              </div>
            </PrivateRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;