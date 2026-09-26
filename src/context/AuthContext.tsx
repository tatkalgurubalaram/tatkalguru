import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../lib/api';

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setAuth: (user: User | null, accessToken: string | null) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setAuth: () => {},
  logout: async () => {},
  checkAuth: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const setAuth = (newUser: User | null, token: string | null) => {
    setUser(newUser);
    if (token) {
      localStorage.setItem('accessToken', token);
    } else {
      localStorage.removeItem('accessToken');
    }
  };

  const checkAuth = async () => {
    try {
      const res = await apiClient.get<{ success: boolean; data: User }>('/auth/me');
      if (res.success) {
        setUser(res.data);
      } else {
        setAuth(null, null);
      }
    } catch (e) {
      setAuth(null, null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout', {});
    } catch (e) {
      // ignore
    }
    setAuth(null, null);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setAuth, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
