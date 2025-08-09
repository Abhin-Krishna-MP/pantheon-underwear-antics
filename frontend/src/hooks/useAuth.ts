import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Mock users for demonstration
const MOCK_USERS: User[] = [
  { id: '1', username: 'admin', email: 'admin@example.com' },
  { id: '2', username: 'user1', email: 'user1@example.com' },
  { id: '3', username: 'user2', email: 'user2@example.com' },
];

// Mock passwords (in real app, these would be hashed)
const MOCK_PASSWORDS: Record<string, string> = {
  'admin': 'admin123',
  'user1': 'password123',
  'user2': 'password123',
};

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('pantheon_user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check if user exists and password matches
      const user = MOCK_USERS.find(u => u.username === username);
      const correctPassword = MOCK_PASSWORDS[username];

      if (!user || password !== correctPassword) {
        toast({
          title: "Login Failed",
          description: "Invalid username or password",
          variant: "destructive",
        });
        return false;
      }

      // Store user in localStorage
      localStorage.setItem('pantheon_user', JSON.stringify(user));
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.username}!`,
      });

      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "An error occurred during login",
        variant: "destructive",
      });
      return false;
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check if username already exists
      if (MOCK_USERS.find(u => u.username === username)) {
        toast({
          title: "Registration Failed",
          description: "Username already exists",
          variant: "destructive",
        });
        return false;
      }

      // Check if email already exists
      if (MOCK_USERS.find(u => u.email === email)) {
        toast({
          title: "Registration Failed",
          description: "Email already exists",
          variant: "destructive",
        });
        return false;
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        username,
        email,
      };

      // Add to mock users and passwords
      MOCK_USERS.push(newUser);
      MOCK_PASSWORDS[username] = password;

      // Store user in localStorage
      localStorage.setItem('pantheon_user', JSON.stringify(newUser));
      
      setAuthState({
        user: newUser,
        isAuthenticated: true,
        isLoading: false,
      });

      toast({
        title: "Registration Successful",
        description: `Welcome, ${username}!`,
      });

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: "An error occurred during registration",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = async (): Promise<boolean> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));

      // Remove user from localStorage
      localStorage.removeItem('pantheon_user');
      
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });

      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });

      return true;
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Failed",
        description: "An error occurred during logout",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    login,
    register,
    logout,
  };
}; 