
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { UserData } from '@/types/auth';

export const useSession = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

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
