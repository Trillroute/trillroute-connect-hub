
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
  const refreshingRef = useRef(false);
  
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

  const refreshAvailability = useCallback(async (showLoadingState = true) => {
    if (refreshingRef.current) {
      console.log('Already refreshing, skipping duplicate request');
      return;
    }
    
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
      refreshingRef.current = true;
      await fetchAvailability(showLoadingState);
    } catch (error) {
      console.error('Error in refreshAvailability:', error);
      // Loading state is already set to false in the actions
    } finally {
      refreshingRef.current = false;
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
      if (refreshingRef.current) {
        console.log('Already refreshing in another effect, skipping');
        return;
      }
      
      try {
        if (isMounted) {
          // Only show loading state on initial load or user change
          const showLoading = isInitialLoad.current || previousUserId !== targetUserId;
          refreshingRef.current = true;
          await refreshAvailability(showLoading);
          if (isMounted) {
            isInitialLoad.current = false;
          }
        }
      } catch (err) {
        console.error('Error in initial load of availability:', err);
        // Error handling is already in refreshAvailability
      } finally {
        refreshingRef.current = false;
      }
    };
    
    loadAvailability();
    
    return () => {
      isMounted = false;
    };
  }, [targetUserId, refreshAvailability, previousUserId]);

  // Enhanced versions of the action functions that prevent loading state flickering
  const enhancedAddSlot = useCallback(async (dayOfWeek: number, startTime: string, endTime: string) => {
    return await addSlot(dayOfWeek, startTime, endTime);
  }, [addSlot]);
  
  const enhancedUpdateSlot = useCallback(async (id: string, startTime: string, endTime: string) => {
    return await updateSlot(id, startTime, endTime);
  }, [updateSlot]);
  
  const enhancedDeleteSlot = useCallback(async (id: string) => {
    return await deleteSlot(id);
  }, [deleteSlot]);
  
  const enhancedCopyDaySlots = useCallback(async (fromDay: number, toDay: number) => {
    return await copyDaySlots(fromDay, toDay);
  }, [copyDaySlots]);

  return {
    loading,
    dailyAvailability,
    refreshAvailability,
    addSlot: enhancedAddSlot,
    updateSlot: enhancedUpdateSlot,
    deleteSlot: enhancedDeleteSlot,
    copyDaySlots: enhancedCopyDaySlots,
    daysOfWeek
  };
}
