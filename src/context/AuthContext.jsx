import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API = '/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('bt_token'));
  const [loading, setLoading] = useState(true);

  // Set default auth header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setLoading(false);
    }
  }, [token]);

  async function fetchUser() {
    try {
      const res = await axios.get(`${API}/auth/me`);
      setUser(res.data.user);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    const res = await axios.post(`${API}/auth/login`, { email, password });
    localStorage.setItem('bt_token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data.user;
  }

  async function register(data) {
    const res = await axios.post(`${API}/auth/register`, data);
    localStorage.setItem('bt_token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data.user;
  }

  function logout() {
    localStorage.removeItem('bt_token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  }

  function getDashboardPath() {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin': return '/admin';
      case 'owner': return '/owner';
      case 'customer': return '/customer';
      default: return '/';
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, getDashboardPath }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
