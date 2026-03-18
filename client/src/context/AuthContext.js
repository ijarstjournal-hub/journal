import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const setAuthHeader = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('adminToken', token);
  } else {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('adminToken');
  }
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setAuthHeader(token);
      axios.get('/api/admin/me')
        .then(res => setAdmin(res.data))
        .catch(() => {
          setAuthHeader(null);
          setAdmin(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await axios.post('/api/admin/login', { email, password });
    setAuthHeader(res.data.token);
    setAdmin({ email: res.data.email });
  };

  const logout = async () => {
    setAuthHeader(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
