'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiClient } from '@/lib/api/client';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          const userData = await apiClient.getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Session check failed:', error);
        localStorage.removeItem('auth_token');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data: any = await apiClient.login(email, password);
      const token: string | undefined = data?.access_token || data?.token?.access_token || data?.data?.access_token;
      if (!token || typeof token !== 'string') {
        console.error('Login failed: Missing token in response');
        return false;
      }
      // Basic JWT shape validation (three segments)
      if (token.split('.').length !== 3) {
        console.error('Login failed: Received malformed token');
        return false;
      }
      localStorage.setItem('auth_token', token);
      
      // Fetch user data after successful login
      const userData = await apiClient.getCurrentUser();
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      // Ensure no bad token lingers
      localStorage.removeItem('auth_token');
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const data = await apiClient.register(email, password, name);
      localStorage.setItem('auth_token', data.access_token);
      
      // Set user data from registration response
      setUser(data.user);
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
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
