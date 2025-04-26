
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { UserData } from '@/types/auth';

interface AuthenticationContextType {
  loading: boolean;
  user: UserData | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthenticationContext = createContext<AuthenticationContextType | undefined>(undefined);

export const AuthenticationProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        console.log('Restored user from storage:', userData);
        
        // Verify with Supabase that the session is still valid
        supabase.auth.getSession().then(({ data, error }) => {
          if (error || !data.session) {
            console.log('Stored session invalid, clearing local storage');
            localStorage.removeItem('user');
            setUser(null);
          }
        });
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      console.log(`[AUTH] Login attempt for email: ${normalizedEmail}`);
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: password,
      });
      
      if (authError) {
        console.error('[AUTH] Supabase auth error:', authError);
      }
      
      console.log(`[AUTH] DEBUG - querying for email: ${normalizedEmail}`);
      
      const { data: users, error: queryError } = await supabase
        .from('custom_users')
        .select('*')
        .eq('email', normalizedEmail);
      
      console.log(`[AUTH] Query returned ${users?.length || 0} users`);
      
      if (queryError) {
        console.error('[AUTH] Database error:', queryError);
        throw new Error('Error connecting to the database. Please try again.');
      }
      
      if (!users || users.length === 0) {
        console.error('[AUTH] No user found with email:', normalizedEmail);
        throw new Error('Invalid email or password');
      }
      
      const userData = users[0];
      console.log(`[AUTH] Found user with ID: ${userData.id}`);
      
      const updatedUser: UserData = {
        id: userData.id,
        email: userData.email,
        firstName: userData.first_name,
        lastName: userData.last_name,
        role: userData.role,
        dateOfBirth: userData.date_of_birth,
        profilePhoto: userData.profile_photo,
        parentName: userData.parent_name,
        guardianRelation: userData.guardian_relation,
        primaryPhone: userData.primary_phone,
        secondaryPhone: userData.secondary_phone,
        whatsappEnabled: userData.whatsapp_enabled,
        address: userData.address,
        idProof: userData.id_proof,
        createdAt: userData.created_at,
        adminRoleName: userData.admin_level_name
      };
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${updatedUser.firstName}!`,
        duration: 3000,
      });
    } catch (error: any) {
      console.error('[AUTH] Login error:', error);
      toast({
        title: "Login Failed",
        description: error?.message || "Invalid credentials. Please try again.",
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
      setUser(null);
      localStorage.removeItem('user');
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthenticationContext.Provider value={value}>{children}</AuthenticationContext.Provider>;
};

export const useAuthentication = (): AuthenticationContextType => {
  const context = useContext(AuthenticationContext);
  if (context === undefined) {
    throw new Error('useAuthentication must be used within an AuthenticationProvider');
  }
  return context;
};
