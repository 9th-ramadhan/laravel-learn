import React, { createContext, useContext, useState, useEffect } from 'react';
import client from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [loading, setLoading] = useState(true);

  // Fetch profil user saat token tersedia
  useEffect(() => {
    if (token) {
      client.get('/user')
        .then((res) => {
          setUser(res.data);
        })
        .catch(() => {
          logout();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await client.post('/login', { email, password });
    const newToken = res.data.access_token;
    localStorage.setItem('access_token', newToken);
    setToken(newToken);
    // Fetch profil user
    const profileRes = await client.get('/user');
    setUser(profileRes.data);
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await client.post('/register', { name, email, password });
    const newToken = res.data.access_token;
    localStorage.setItem('access_token', newToken);
    setToken(newToken);
    setUser(res.data.data);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
