
import { useState, useCallback, useEffect } from 'react';
import { UserAvailability, UserAvailabilityMap } from '@/services/availability/types';
import { 
  fetchUserAvailability,
  fetchUserAvailabilityForDate,
  fetchUserAvailabilityForWeek,
  fetchUserAvailabilityForUsers,
} from '@/services/userAvailabilityService';
import { transformAvailabilityData } from '@/hooks/availability/availabilityTransforms';
import { DayAvailability } from '@/hooks/availability/types';
import { useToast } from '@/hooks/use-toast';
import { useAvailabilityOperations } from './useAvailabilityOperations';

// Helper function to create a separate scope for availability queries
const useAvailabilityQueries = (userId: string | undefined) => {
  // Fetch availability for a specific date
  const getAvailabilityForDate = useCallback(async (date: Date) => {
    if (!userId) return [];
    
    try {
      return await fetchUserAvailabilityForDate(userId, date);
    } catch (error) {
      console.error('Failed to fetch availability for date:', error);
      return [];
    }
  }, [userId]);
  
  // Fetch availability for an entire week
  const getAvailabilityForWeek = useCallback(async () => {
    if (!userId) return [];
    
    try {
      return await fetchUserAvailabilityForWeek(userId);
    } catch (error) {
      console.error('Failed to fetch weekly availability:', error);
      return [];
    }
  }, [userId]);
  
  // Fetch availability for multiple users
  const getMultiUserAvailability = useCallback(async (userIds: string[]) => {
    try {
      if (!userIds.length) return {};
      
      console.log(`Fetching availability for ${userIds.length} users`);
      return await fetchUserAvailabilityForUsers(userIds);
    } catch (error) {
      console.error('Failed to fetch multi-user availability:', error);
      return {};
    }
  }, []);

  return {
    getAvailabilityForDate,
    getAvailabilityForWeek,
    getMultiUserAvailability
  };
};

// Main hook for user availability functionality
export const useUserAvailability = (userId: string | undefined) => {
  const [userAvailability, setUserAvailability] = useState<UserAvailability[]>([]);
  const [availabilityData, setAvailabilityData] = useState<UserAvailabilityMap>({});
  const [isLoading, setIsLoading] = useState(false);
  const [dailyAvailability, setDailyAvailability] = useState<DayAvailability[]>([]);
  const { toast } = useToast();
  
  // Fetch availability slots for a specific user
  const refreshAvailability = useCallback(async () => {
    if (!userId) {
      console.log('No user ID provided for availability');
      return null;
    }
    
    setIsLoading(true);
    try {
      console.log(`Fetching availability for user ${userId}`);
      const data = await fetchUserAvailability(userId);
      setUserAvailability(data);
      
      // Transform data for calendar context
      if (data && data.length > 0) {
        // Process data into daily availability format
        const transformedData = transformAvailabilityData(data);
        setDailyAvailability(transformedData);
        
        // Process data for the calendar context
        const userName = data[0].userName || data[0].user_name || 'User';
        
        const formattedData: UserAvailabilityMap = {
          [userId]: {
            name: userName,
            slots: data.map(item => ({
              dayOfWeek: item.dayOfWeek,
              startTime: item.startTime,
              endTime: item.endTime,
              category: item.category || 'Session'
            })),
            role: 'teacher' // Set default role
          }
        };
        
        setAvailabilityData(formattedData);
        console.log(`Processed ${data.length} availability slots for user`, formattedData);
        return formattedData;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to fetch user availability:', error);
    } finally {
      setIsLoading(false);
    }
    
    return null;
  }, [userId]);

  // Get CRUD operations from separate hook
  const { 
    addSlot, 
    updateSlot, 
    deleteSlot, 
    copyDaySlots 
  } = useAvailabilityOperations(userId, refreshAvailability, { toast });

  // Fetch availability for a specific date or week
  const { 
    getAvailabilityForDate, 
    getAvailabilityForWeek,
    getMultiUserAvailability
  } = useAvailabilityQueries(userId);
  
  // Load initial availability on component mount
  useEffect(() => {
    if (userId) {
      refreshAvailability();
    }
  }, [userId, refreshAvailability]);
  
  return {
    userAvailability,
    availabilityData,
    isLoading,
    refreshAvailability,
    getAvailabilityForDate,
    getAvailabilityForWeek,
    getMultiUserAvailability,
    // Add the missing properties
    dailyAvailability,
    loading: isLoading, // Alias for backward compatibility
    addSlot,
    updateSlot,
    deleteSlot,
    copyDaySlots
  };
};
