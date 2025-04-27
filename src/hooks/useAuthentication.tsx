
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { UserData, UserRole } from '@/types/auth';

interface AuthenticationContextType {
  loading: boolean;
  user: UserData | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  refreshSession: () => Promise<boolean>;
}

const AuthenticationContext = createContext<AuthenticationContextType | undefined>(undefined);

export const AuthenticationProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Function to refresh the session
  const refreshSession = async () => {
    try {
      console.log('Attempting to refresh session...');
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error refreshing session:', error);
        return false;
      }
      
      if (!data.session) {
        console.log('No active session found during refresh');
        return false;
      }
      
      // If we have a session but no user data, attempt to restore from localStorage
      if (!user) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            console.log('Restored user from storage during refresh:', userData);
          } catch (parseError) {
            console.error('Error parsing stored user data:', parseError);
          }
        }
      }
      
      console.log('Session refreshed successfully');
      return true;
    } catch (error) {
      console.error('Exception during session refresh:', error);
      return false;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          console.log('Restored user from storage:', userData);
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          localStorage.removeItem('user');
        }
      }

      // Set up auth state listener to catch changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state change event:', event);
        
        if (event === 'SIGNED_IN') {
          // If we get a SIGNED_IN event but already have a user, no need to refetch
          if (!user && session?.user?.email) {
            console.log('User signed in, fetching user data');
            try {
              const { data: users, error: queryError } = await supabase
                .from('custom_users')
                .select('*')
                .eq('email', session.user.email.toLowerCase());
              
              if (queryError) {
                console.error('Error fetching user data on auth state change:', queryError);
                return;
              }
              
              if (users && users.length > 0) {
                const userData = users[0];
                const userRole: UserRole = userData.role as UserRole;
                
                const updatedUser: UserData = {
                  id: userData.id,
                  email: userData.email,
                  firstName: userData.first_name,
                  lastName: userData.last_name,
                  role: userRole,
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
                console.log('User data updated from auth state change');
              }
            } catch (error) {
              console.error('Exception when handling auth state change:', error);
            }
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out, clearing user data');
          setUser(null);
          localStorage.removeItem('user');
        }
      });
      
      // Initial session check
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error checking initial session:', error);
      } else if (!data.session) {
        console.log('No active session found during initialization');
        // Clear any stale user data if no active session
        if (user) {
          setUser(null);
          localStorage.removeItem('user');
        }
      } else {
        console.log('Active session found during initialization');
      }
      
      setLoading(false);
      
      return () => {
        subscription.unsubscribe();
      };
    };
    
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      console.log(`[AUTH] Login attempt for email: ${normalizedEmail}`);
      
      // Check if email exists in the database first
      const { data: usersCheck, error: checkError } = await supabase
        .from('custom_users')
        .select('email')
        .eq('email', normalizedEmail)
        .limit(1);
      
      if (checkError) {
        console.error('[AUTH] Error checking user existence:', checkError);
        throw new Error("Error connecting to the database. Please try again.");
      } 
      
      if (!usersCheck || usersCheck.length === 0) {
        console.error('[AUTH] No account found with email:', normalizedEmail);
        toast({
          title: "Account Not Found",
          description: "No account found with this email address. Please check your email or register for a new account.",
          variant: "destructive",
          duration: 5000,
        });
        throw new Error("Account not found");
      }
      
      // Proceed with authentication attempt
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: password,
      });
      
      if (authError) {
        console.error('[AUTH] Supabase auth error:', authError);
        
        // Provide more specific error messages based on the error code
        if (authError.message.includes('Invalid login')) {
          toast({
            title: "Incorrect Password",
            description: "The password you entered is incorrect. Please try again.",
            variant: "destructive",
            duration: 3000,
          });
          throw new Error("Incorrect password");
        } else {
          toast({
            title: "Login Failed",
            description: authError.message || "Unable to sign in. Please try again.",
            variant: "destructive",
            duration: 3000,
          });
          throw new Error(authError.message || 'Login failed');
        }
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
        throw new Error('User account data not found');
      }
      
      const userData = users[0];
      console.log(`[AUTH] Found user with ID: ${userData.id}`);
      
      // Ensure the role is a valid UserRole type
      const userRole: UserRole = userData.role as UserRole;
      
      const updatedUser: UserData = {
        id: userData.id,
        email: userData.email,
        firstName: userData.first_name,
        lastName: userData.last_name,
        role: userRole,
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
      // Only show toast if it wasn't already shown in specific error handling
      if (!error.message || (error.message !== "Account not found" && error.message !== "Incorrect password")) {
        toast({
          title: "Login Failed",
          description: error?.message || "Something went wrong. Please try again.",
          variant: "destructive",
          duration: 3000,
        });
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Sign out from Supabase auth
      await supabase.auth.signOut();
      
      // Clear local state
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
    refreshSession,
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
