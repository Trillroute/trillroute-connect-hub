
import React, { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthenticationContext } from '@/contexts/AuthContext';
import { useSession } from '@/hooks/useSession';
import { useAuthActions } from '@/hooks/useAuthActions';
import type { UserData } from '@/types/auth';

export const AuthenticationProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, setUser, loading, setLoading, refreshSession } = useSession();
  const { login, logout } = useAuthActions(setUser, setLoading);

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

      // Set up auth state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state change event:', event);
        
        if (event === 'SIGNED_IN') {
          if (!user && session?.user?.email) {
            console.log('User signed in, fetching user data');
            try {
              await fetchUserData(session.user.email, setUser);
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

// Helper function
const fetchUserData = async (email: string, setUser: (user: UserData | null) => void) => {
  const { data: users, error: queryError } = await supabase
    .from('custom_users')
    .select('*')
    .eq('email', email.toLowerCase());
  
  if (queryError || !users || users.length === 0) {
    console.error('Error fetching user data:', queryError);
    return;
  }
  
  const userData = users[0];
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
};
