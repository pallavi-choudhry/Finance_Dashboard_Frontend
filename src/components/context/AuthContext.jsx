import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const userData = authService.getCurrentUser();
      if (!userData) {
        setLoading(false);
        return;
      }

      // Show cached user instantly, then sync latest role/status from backend
      setUser(userData);
      try {
        const me = await authService.getMe();
        if (me?.user) {
          setUser(me.user);
          localStorage.setItem('user', JSON.stringify(me.user));
        }
      } catch (error) {
        authService.logout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
      toast.success('Login successful!');
      return response.user;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return null;
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await authService.register({ name, email, password });
      setUser(response.user);
      toast.success('Registration successful!');
      return response.user;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return null;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};