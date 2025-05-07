
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
  
  // Debug log when target user ID changes
  useEffect(() => {
    console.log(`useUserAvailability hook initialized/updated with targetUserId:`, targetUserId);
    if (!targetUserId) {
      console.warn('No target user ID available, availability data may not load correctly');
    }
  }, [targetUserId]);
  
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
      await fetchAvailability();
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
        if (targetUserId && isMounted) {
          refreshingRef.current = true;
          await refreshAvailability();
          if (isMounted) {
            isInitialLoad.current = false;
          }
        } else {
          console.log('No targetUserId available, skipping initial load');
          setLoading(false);
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
  }, [targetUserId, refreshAvailability]);

  // Enhanced versions of the action functions that prevent loading state flickering
  const enhancedAddSlot = useCallback(async (dayOfWeek: number, startTime: string, endTime: string) => {
    console.log(`Adding slot for day ${dayOfWeek} from ${startTime} to ${endTime}`);
    return await addSlot(dayOfWeek, startTime, endTime);
  }, [addSlot]);
  
  const enhancedUpdateSlot = useCallback(async (id: string, startTime: string, endTime: string) => {
    console.log(`Updating slot ${id} to ${startTime}-${endTime}`);
    return await updateSlot(id, startTime, endTime);
  }, [updateSlot]);
  
  const enhancedDeleteSlot = useCallback(async (id: string) => {
    console.log(`Deleting slot ${id}`);
    return await deleteSlot(id);
  }, [deleteSlot]);
  
  const enhancedCopyDaySlots = useCallback(async (fromDay: number, toDay: number) => {
    console.log(`Copying slots from day ${fromDay} to day ${toDay}`);
    return await copyDaySlots(fromDay, toDay);
  }, [copyDaySlots]);

  // Debug log when availability data changes
  useEffect(() => {
    console.log('Current availability data in hook:', 
      dailyAvailability.map(day => ({
        day: day.dayName,
        slots: day.slots.length
      }))
    );
  }, [dailyAvailability]);

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
