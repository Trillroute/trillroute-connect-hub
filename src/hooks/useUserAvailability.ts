
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
      setLoading(false);
      return Promise.resolve();
    }
    
    console.log('Refreshing availability for user ID:', targetUserId);
    return fetchAvailability();
  }, [targetUserId, fetchAvailability]);

  useEffect(() => {
    if (targetUserId) {
      console.log('User ID changed, refreshing availability for:', targetUserId);
      refreshAvailability();
    } else {
      // If no user ID, set empty data and stop loading
      console.log('No user ID available, setting empty availability data');
      setDailyAvailability([]);
      setLoading(false);
    }
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
