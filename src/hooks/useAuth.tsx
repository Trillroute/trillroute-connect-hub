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
  isAdmin: () => boolean;
}

const validUsers = [
  {
    id: "user_1",
    email: "student@example.com",
    password: "password",
    firstName: "Student",
    lastName: "User",
    role: "student" as UserRole
  },
  {
    id: "user_2",
    email: "teacher@example.com",
    password: "password",
    firstName: "Teacher",
    lastName: "User",
    role: "teacher" as UserRole
  },
  {
    id: "user_3",
    email: "admin@example.com",
    password: "password",
    firstName: "Admin",
    lastName: "User",
    role: "admin" as UserRole
  }
];

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

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Check if the email and password match a valid user
      const foundUser = validUsers.find(
        (u) => u.email === email && u.password === password
      );
      
      if (!foundUser) {
        throw new Error("Invalid email or password");
      }
      
      const authenticatedUser: User = {
        id: foundUser.id,
        email: foundUser.email,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        role: foundUser.role,
      };
      
      setUser(authenticatedUser);
      localStorage.setItem('trillroute_user', JSON.stringify(authenticatedUser));
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${authenticatedUser.firstName}!`,
        duration: 3000,
      });
      
      // Redirect based on role
      navigate(`/dashboard/${authenticatedUser.role}`);
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string, role: UserRole) => {
    setLoading(true);
    try {
      // Check if user with this email already exists
      if (validUsers.some(u => u.email === email)) {
        throw new Error("User with this email already exists");
      }
      
      // In a real app, we'd add the user to the database
      // For now, we'll just simulate successful registration
      const newUser: User = {
        id: `user_${Date.now()}`,
        email,
        firstName,
        lastName,
        role,
      };
      
      setUser(newUser);
      localStorage.setItem('trillroute_user', JSON.stringify(newUser));
      
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
        description: error instanceof Error ? error.message : "Please check your information and try again.",
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

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const value = {
    user,
    loading,
    role: user?.role || null,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin,
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
