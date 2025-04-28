
import React, { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthenticationContext } from '@/contexts/AuthContext';
import { useSession } from '@/hooks/useSession';
import { useAuthActions } from '@/hooks/useAuthActions';
import { useNavigate, useLocation } from 'react-router-dom';
import type { UserData, UserRole } from '@/types/auth';
import { toast } from 'sonner';

export const AuthenticationProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, setUser, loading, setLoading, refreshSession } = useSession();
  const { login, logout } = useAuthActions(setUser, setLoading);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const initAuth = async () => {
      // Try to restore user from localStorage first for immediate UI feedback
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
          if (session?.user?.email) {
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
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed event received');
        }
      });
      
      // Initial session check
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error checking initial session:', error);
        } else if (!data.session) {
          console.log('No active session found during initialization');
          // Don't clear user data here - our custom auth might still be valid
        } else {
          console.log('Active session found during initialization');
          if (data.session.user.email && !user) {
            await fetchUserData(data.session.user.email, setUser);
          }
        }
      } catch (sessionError) {
        console.error('Exception checking initial session:', sessionError);
      }
      
      setLoading(false);
      
      return () => {
        subscription.unsubscribe();
      };
    };
    
    initAuth();
  }, []);

  // Redirect based on authentication status
  useEffect(() => {
    if (loading) return;

    const checkDashboardRedirect = () => {
      // If we're at the /dashboard route (which doesn't exist), redirect to the correct dashboard
      if (location.pathname === '/dashboard' && user) {
        const dashboardRoute = `/dashboard/${user.role}`;
        console.log(`Redirecting to correct dashboard: ${dashboardRoute}`);
        navigate(dashboardRoute, { replace: true });
        return true;
      }
      return false;
    };

    // Handle dashboard routing if needed
    if (checkDashboardRedirect()) return;

  }, [loading, user, navigate, location.pathname]);

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
  try {
    const { data: users, error: queryError } = await supabase
      .from('custom_users')
      .select('*')
      .eq('email', email.toLowerCase());
    
    if (queryError || !users || users.length === 0) {
      console.error('Error fetching user data:', queryError);
      return;
    }
    
    const userData = users[0];
    // Ensure role is a valid UserRole type
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
    
    console.log('User data fetched and updated:', updatedUser);
  } catch (error) {
    console.error('Exception fetching user data:', error);
  }
};
