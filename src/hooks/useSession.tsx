
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { UserData } from '@/types/auth';

export const useSession = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = async () => {
    try {
      console.log('Attempting to refresh session...');
      
      // Try to refresh the session directly with Supabase
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Error refreshing session:', error);
        return false;
      }
      
      if (!data.session) {
        console.log('No active session found during refresh');
        
        // As a fallback, check if we have a session anyway
        const { data: sessionCheck } = await supabase.auth.getSession();
        if (!sessionCheck.session) {
          console.log('No session found in getSession either');
          return false;
        }
        
        console.log('Found session via getSession');
        // Continue with the session we found
      }
      
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

  return {
    user,
    setUser,
    loading,
    setLoading,
    refreshSession
  };
};
