import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '@/types';
import { api, TOKEN_KEY } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    city?: string;
    role: 'user' | 'organizer';
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const userData = await api.getProfile();
      setUser(userData);
    } catch (error) {
      console.error('Failed to load user:', error);
      localStorage.removeItem(TOKEN_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email: string, password: string) => {
    const response = await api.login(email, password);
    localStorage.setItem(TOKEN_KEY, response.token);
    setUser(response.user);
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    city?: string;
    role: 'user' | 'organizer';
  }) => {
    const response = await api.register(data);
    localStorage.setItem(TOKEN_KEY, response.token);
    setUser(response.user);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
