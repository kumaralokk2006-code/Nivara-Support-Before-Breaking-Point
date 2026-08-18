import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('nivara_token') : null;
      if (token) {
        try {
          const res = await authService.getMe();
          setUser(res.user);
          setProfile(res.profile);
        } catch (err) {
          console.warn('Session initialization failed:', err.message);
          localStorage.removeItem('nivara_token');
          localStorage.removeItem('nivara_user');
          setUser(null);
          setProfile(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    setUser(res.user);
    const meRes = await authService.getMe();
    setProfile(meRes.profile);
    
    // Redirect based on role
    if (res.user.role === 'STUDENT') {
      router.push('/student/dashboard');
    } else if (res.user.role === 'COUNSELLOR') {
      router.push('/counsellor');
    } else if (res.user.role === 'ADMIN') {
      router.push('/admin');
    }
    return res;
  };

  const register = async (formData) => {
    const res = await authService.register(formData);
    setUser(res.user);
    const meRes = await authService.getMe();
    setProfile(meRes.profile);

    if (res.user.role === 'STUDENT') {
      router.push('/student/dashboard');
    } else if (res.user.role === 'COUNSELLOR') {
      router.push('/counsellor');
    } else if (res.user.role === 'ADMIN') {
      router.push('/admin');
    }
    return res;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setProfile(null);
    router.push('/login');
  };

  const refreshUser = async () => {
    try {
      const res = await authService.getMe();
      setUser(res.user);
      setProfile(res.profile);
    } catch (e) {
      // Ignore
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      login,
      register,
      logout,
      refreshUser,
      isStudent: user?.role === 'STUDENT',
      isCounsellor: user?.role === 'COUNSELLOR',
      isAdmin: user?.role === 'ADMIN'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
