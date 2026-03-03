import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/admin/me', { withCredentials: true })
      .then(res => setAdmin(res.data))
      .catch(() => setAdmin(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    await axios.post('/api/admin/login', { email, password }, { withCredentials: true });
    const res = await axios.get('/api/admin/me', { withCredentials: true });
    setAdmin(res.data);
  };

  const logout = async () => {
    await axios.post('/api/admin/logout', {}, { withCredentials: true });
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
