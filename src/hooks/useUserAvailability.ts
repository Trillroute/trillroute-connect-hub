
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

  const refreshAvailability = useCallback(async () => {
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
      return;
    }
    
    console.log('Refreshing availability for user ID:', targetUserId);
    try {
      await fetchAvailability();
    } catch (error) {
      console.error('Error in refreshAvailability:', error);
      // Loading state is already set to false in the actions
    }
  }, [targetUserId, fetchAvailability]);

  useEffect(() => {
    let isMounted = true;
    
    const loadAvailability = async () => {
      try {
        await refreshAvailability();
      } catch (err) {
        console.error('Error in initial load of availability:', err);
        // Error handling is already in refreshAvailability
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
