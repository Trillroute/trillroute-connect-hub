
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export type UserRole = 'student' | 'teacher' | 'admin';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  role: UserRole | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check local storage for user data when component mounts
    const storedUser = localStorage.getItem('trillroute_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('trillroute_user');
      }
    }
    setLoading(false);
  }, []);

  // In a real app, this would communicate with Supabase
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulating authentication - in a real app, this would call Supabase auth
      // For demo purposes, we'll simulate different roles based on email
      let role: UserRole = 'student';
      if (email.includes('teacher')) {
        role = 'teacher';
      } else if (email.includes('admin')) {
        role = 'admin';
      }
      
      const mockUser: User = {
        id: `user_${Date.now()}`,
        email,
        firstName: 'Demo',
        lastName: 'User',
        role,
      };
      
      setUser(mockUser);
      localStorage.setItem('trillroute_user', JSON.stringify(mockUser));
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${mockUser.firstName}!`,
        duration: 3000,
      });
      
      // Redirect based on role
      navigate(`/dashboard/${role}`);
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // In a real app, this would communicate with Supabase
  const register = async (email: string, password: string, firstName: string, lastName: string, role: UserRole) => {
    setLoading(true);
    try {
      // Simulating registration - in a real app, this would call Supabase auth
      const mockUser: User = {
        id: `user_${Date.now()}`,
        email,
        firstName,
        lastName,
        role,
      };
      
      setUser(mockUser);
      localStorage.setItem('trillroute_user', JSON.stringify(mockUser));
      
      toast({
        title: "Registration Successful",
        description: `Welcome to Trillroute, ${firstName}!`,
        duration: 3000,
      });
      
      // Redirect based on role
      navigate(`/dashboard/${role}`);
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: "Please check your information and try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('trillroute_user');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
      duration: 3000,
    });
    navigate('/');
  };

  const value = {
    user,
    loading,
    role: user?.role || null,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
