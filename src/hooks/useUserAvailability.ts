
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { daysOfWeek } from './availability/dayUtils';
import { useAvailabilityActions } from './availability/availabilityActions';
import { DayAvailability, UseAvailabilityResult } from './availability/types';

export type { DayAvailability } from './availability/types';

export function useUserAvailability(userId?: string): UseAvailabilityResult {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dailyAvailability, setDailyAvailability] = useState<DayAvailability[]>([]);
  
  // Use the provided userId or fall back to the current user's ID
  const targetUserId = userId || (user ? user.id : '');
  
  const { 
    refreshAvailability: fetchAvailability,
    addSlot,
    updateSlot,
    deleteSlot,
    copyDaySlots 
  } = useAvailabilityActions(
    targetUserId,
    setLoading,
    setDailyAvailability
  );

  const refreshAvailability = useCallback(() => {
    if (!targetUserId) {
      console.log('No target user ID provided, skipping availability fetch');
      // Initialize with empty data structure
      const emptyAvailability = daysOfWeek.map((dayName, index) => ({
        dayOfWeek: index,
        dayName,
        slots: []
      }));
      setDailyAvailability(emptyAvailability);
      setLoading(false);
      return Promise.resolve();
    }
    
    console.log('Refreshing availability for user ID:', targetUserId);
    return fetchAvailability();
  }, [targetUserId, fetchAvailability]);

  useEffect(() => {
    let isMounted = true;
    
    const loadAvailability = async () => {
      // Set loading to true on userId change
      setLoading(true);
      
      if (targetUserId) {
        console.log('User ID changed, refreshing availability for:', targetUserId);
        try {
          await refreshAvailability();
        } catch (err) {
          console.error('Error refreshing availability:', err);
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      } else {
        // If no user ID, set empty data and stop loading
        console.log('No user ID available, setting empty availability data');
        const emptyAvailability = daysOfWeek.map((dayName, index) => ({
          dayOfWeek: index,
          dayName,
          slots: []
        }));
        if (isMounted) {
          setDailyAvailability(emptyAvailability);
          setLoading(false);
        }
      }
    };
    
    loadAvailability();
    
    return () => {
      isMounted = false;
    };
  }, [targetUserId, refreshAvailability]);

  return {
    loading,
    dailyAvailability,
    refreshAvailability,
    addSlot,
    updateSlot,
    deleteSlot,
    copyDaySlots,
    daysOfWeek
  };
}
