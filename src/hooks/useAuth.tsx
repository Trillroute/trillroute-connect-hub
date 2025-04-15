
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, hashPassword, verifyPassword } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type UserRole = 'student' | 'teacher' | 'admin';

interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

// Update the interface to match custom_users table
interface CustomUser {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  created_at: string;
}

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  role: UserRole | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Initialize the auth state from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Login function - now checks credentials against custom_users table
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Ensure email is normalized consistently
      const normalizedEmail = email.trim().toLowerCase();
      console.log('Login attempt for normalized email:', normalizedEmail);
      
      // First check if the user exists at all
      const { data, error } = await supabase
        .from('custom_users')
        .select('*')
        .ilike('email', normalizedEmail)
        .maybeSingle();

      console.log('Login query result:', data, error);

      if (error) {
        console.error('Database error when fetching user:', error);
        throw new Error('Error connecting to the database. Please try again.');
      }

      if (!data) {
        console.error('No user found with email:', normalizedEmail);
        throw new Error('Invalid email or password');
      }

      // Type assertion to match CustomUser interface
      const userData = data as CustomUser;
      
      console.log('User found, verifying password');
      console.log('Stored password hash:', userData.password_hash);

      // Verify password with detailed logging
      const isPasswordValid = await verifyPassword(password, userData.password_hash);
      console.log('Password valid:', isPasswordValid);
      
      if (!isPasswordValid) {
        console.error('Invalid password for user:', normalizedEmail);
        throw new Error('Invalid email or password');
      }

      // Create user object from database data
      const authUser: UserData = {
        id: userData.id,
        email: userData.email,
        firstName: userData.first_name,
        lastName: userData.last_name,
        role: userData.role,
      };

      // Store user in state and localStorage
      setUser(authUser);
      localStorage.setItem('user', JSON.stringify(authUser));

      toast({
        title: "Login Successful",
        description: "Welcome back!",
        duration: 3000,
      });

      // Redirect based on role
      navigate(`/dashboard/${authUser.role}`);
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error?.message || "Invalid email or password. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string, role: UserRole) => {
    setLoading(true);
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('custom_users')
        .select('id')
        .eq('email', email.toLowerCase())
        .single();

      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Hash the password
      const passwordHash = await hashPassword(password);

      // Generate a UUID for the user
      const userId = crypto.randomUUID();

      // Insert new user into custom_users table
      const { error } = await supabase
        .from('custom_users')
        .insert({
          id: userId,
          email: email.toLowerCase(),
          password_hash: passwordHash,
          first_name: firstName,
          last_name: lastName,
          role: role,
          created_at: new Date().toISOString()
        });

      if (error) {
        throw error;
      }

      // Create user object
      const userData: UserData = {
        id: userId,
        email: email.toLowerCase(),
        firstName,
        lastName,
        role,
      };

      // Store user in state and localStorage
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      toast({
        title: "Registration Successful",
        description: "Welcome to Trillroute!",
        duration: 3000,
      });

      // Redirect based on role
      navigate(`/dashboard/${role}`);
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error?.message || "Please check your information and try again.",
        variant: "destructive",
        duration: 3000,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Just remove user from state and localStorage
      setUser(null);
      localStorage.removeItem('user');
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
        duration: 3000,
      });
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
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
