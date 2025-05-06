
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { daysOfWeek } from './availability/dayUtils';
import { useAvailabilityActions } from './availability/availabilityActions';
import { DayAvailability, UseAvailabilityResult } from './availability/types';

export type { DayAvailability } from './availability/types';

export function useUserAvailability(userId?: string): UseAvailabilityResult {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dailyAvailability, setDailyAvailability] = useState<DayAvailability[]>([]);
  const [previousUserId, setPreviousUserId] = useState<string | undefined>(userId);
  const isInitialLoad = useRef(true);
  
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

  // When user ID changes, set loading state to true and update previous user ID
  useEffect(() => {
    if (previousUserId !== targetUserId) {
      console.log(`User changed from ${previousUserId} to ${targetUserId}, resetting loading state`);
      setLoading(true);
      setPreviousUserId(targetUserId);
      
      // Reset availability data when user changes to prevent showing previous user's data
      const emptyAvailability = daysOfWeek.map((dayName, index) => ({
        dayOfWeek: index,
        dayName,
        slots: []
      }));
      setDailyAvailability(emptyAvailability);
    }
  }, [targetUserId, previousUserId]);

  // Load availability data whenever targetUserId changes
  useEffect(() => {
    let isMounted = true;
    
    const loadAvailability = async () => {
      try {
        if (isMounted) {
          // Only show loading state on initial load or user change
          if (isInitialLoad.current) {
            setLoading(true);
          }
          await refreshAvailability();
          if (isMounted) {
            isInitialLoad.current = false;
          }
        }
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
