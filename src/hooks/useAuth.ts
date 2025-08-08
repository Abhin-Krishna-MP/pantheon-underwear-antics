import { useEffect, useState } from 'react';

export interface User {
  id: number;
  username: string;
  email?: string;
}

const API_BASE_URL = 'http://localhost:8000/api';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/user/`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      console.log('Attempting login with:', { username, password: password ? '[REDACTED]' : '[EMPTY]' });
      
      const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      console.log('Login response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        return { success: true, message: data.message };
      } else {
        const errorData = await response.json();
        console.log('Login error data:', errorData);
        return { success: false, message: errorData.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, message: 'Network error' };
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        return { success: true, message: data.message };
      } else {
        const errorData = await response.json();
        return { success: false, message: errorData.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, message: 'Network error' };
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (response.ok) {
        console.log('Logout successful');
        setUser(null);
        return { success: true, message: 'Logout successful' };
      } else {
        console.error('Logout failed:', response.status);
        setUser(null);
        return { success: false, message: 'Logout failed' };
      }
    } catch (error) {
      console.error('Logout failed:', error);
      setUser(null);
      return { success: false, message: 'Network error during logout' };
    }
  };

  return { user, loading, login, register, logout, checkAuth } as const;
} 