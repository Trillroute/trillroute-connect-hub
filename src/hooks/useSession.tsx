
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { UserData } from '@/types/auth';

export const useSession = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = async () => {
    try {
      console.log('Attempting to refresh session...');
      
      // First check if we have a user in localStorage
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
      
      // Try to refresh the session directly with Supabase
      try {
        const { data, error } = await supabase.auth.refreshSession();
        
        if (error) {
          console.log('Session refresh returned error:', error);
          // Continue with the flow - we may still have valid user data
        } else if (data.session) {
          console.log('Session refreshed successfully via refreshSession');
          return true;
        }
      } catch (refreshError) {
        console.log('Exception during refreshSession call:', refreshError);
        // Continue with the flow
      }
      
      // As a fallback, check if we have a session anyway
      try {
        const { data: sessionCheck } = await supabase.auth.getSession();
        if (sessionCheck.session) {
          console.log('Found session via getSession');
          return true;
        }
      } catch (sessionCheckError) {
        console.log('Exception during getSession call:', sessionCheckError);
      }
      
      // If we have a user from localStorage but no session, we'll consider it valid
      // This helps with cases where Supabase auth might fail but we still have user data
      if (user || storedUser) {
        console.log('No active Supabase session, but using stored user data');
        return true;
      }
      
      console.log('No session or stored user data found');
      return false;
    } catch (error) {
      console.error('Exception during session refresh:', error);
      // If we have a user from localStorage, still return true
      return !!user || !!localStorage.getItem('user');
    }
  };

  return {
    user,
    setUser,
    loading,
    setLoading,
    refreshSession
  };
};
