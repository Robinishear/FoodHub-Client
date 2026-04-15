/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { authService } from '@/services/authService';
import { User } from '@/types';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, newUser: User) => void;
  logout: () => void;
  resyncUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const parseCachedUser = (raw: string | null): User | null => {
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      const parsedStoredUser = parseCachedUser(storedUser);

      if (storedToken) {
        try {
          if (parsedStoredUser) {
            setUser(parsedStoredUser);
            setToken(storedToken);
            setLoading(false);
          }

          const freshUser = await authService.getProfile();

          setUser(freshUser);
          setToken(storedToken);
          localStorage.setItem('user', JSON.stringify(freshUser));
        } catch (error: any) {
          console.warn('Session verification issue:', error?.userMessage || error?.message);

          if (
            error.code === 'ERR_NETWORK' ||
            error.message === 'Network Error'
          ) {
            console.warn('Network unavailable. Using cached user data.');
            // Keep the cached user data and continue
            if (parsedStoredUser) {
              setUser(parsedStoredUser);
              setToken(storedToken);
            }
          } else if (
            error.response?.status === 401 ||
            error.response?.status === 403
          ) {
            // Only logout on authentication errors, not network errors
            logout();
          }
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));

    if (newUser.role === 'ADMIN') router.push('/admin/dashboard');
    else if (newUser.role === 'PROVIDER') router.push('/provider/dashboard');
    else if (newUser.role === 'MANAGER') router.push('/dashboard/manager');
    else if (newUser.role === 'ORGANIZER') router.push('/dashboard/organizer');
    else if (newUser.role === 'CUSTOMER') router.push('/dashboard/customer');
    else router.push('/dashboard/customer');

    toast.success(`Welcome back, ${newUser.name}!`);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
    toast.success('Logged out successfully');
  };

  const resyncUser = async () => {
    try {
      const freshUser = await authService.getProfile();
      setUser(freshUser);
      localStorage.setItem('user', JSON.stringify(freshUser));
    } catch (error) {
      console.warn('Identity resync failed');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, resyncUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
