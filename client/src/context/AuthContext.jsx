import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('hotelpro_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('hotelpro_user');
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      const { token: receivedToken, user: receivedUser } = res.data;

      localStorage.setItem('hotelpro_token', receivedToken);
      localStorage.setItem('hotelpro_user', JSON.stringify(receivedUser));

      setToken(receivedToken);
      setUser(receivedUser);
      return { success: true, user: receivedUser };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please check credentials.';
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      const res = await authAPI.register(userData);
      const { token: receivedToken, user: receivedUser } = res.data;

      localStorage.setItem('hotelpro_token', receivedToken);
      localStorage.setItem('hotelpro_user', JSON.stringify(receivedUser));

      setToken(receivedToken);
      setUser(receivedUser);
      return { success: true, user: receivedUser };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Try again.';
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('hotelpro_token');
    localStorage.removeItem('hotelpro_user');
    setToken(null);
    setUser(null);
  };

  const demoLogin = async (role = 'guest') => {
    const credentials = {
      admin: { email: 'admin@hotelpro.com', password: 'admin123' },
      staff: { email: 'staff@hotelpro.com', password: 'staff123' },
      guest: { email: 'guest@hotelpro.com', password: 'guest123' },
    }[role];

    if (credentials) {
      return await login(credentials.email, credentials.password);
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    demoLogin,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isStaff: user?.role === 'staff' || user?.role === 'admin',
    isGuest: user?.role === 'guest',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
