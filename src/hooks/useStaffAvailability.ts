
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserAvailability, DbUserAvailability } from '@/services/availability/types';
import { mapDbToUserAvailability } from '@/services/availability/availabilityMappers';

export interface UseStaffAvailabilityResult {
  availabilities: UserAvailability[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useStaffAvailability = (userId?: string): UseStaffAvailabilityResult => {
  const [availabilities, setAvailabilities] = useState<UserAvailability[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchAvailabilities = async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error: supabaseError } = await supabase
        .from('user_availability')
        .select('*')
        .eq('user_id', userId);
      
      if (supabaseError) {
        throw new Error(supabaseError.message);
      }
      
      // Map DB fields to our frontend model
      const mappedData: UserAvailability[] = (data as DbUserAvailability[]).map(mapDbToUserAvailability);
      
      setAvailabilities(mappedData);
    } catch (err) {
      console.error('Error fetching staff availability:', err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchAvailabilities();
  }, [userId]);

  return { 
    availabilities, 
    isLoading, 
    error, 
    refetch: fetchAvailabilities 
  };
};
