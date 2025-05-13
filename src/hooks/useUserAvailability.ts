
import { useState, useCallback, useEffect } from 'react';
import { UserAvailability, UserAvailabilityMap } from '@/services/availability/types';
import { 
  fetchUserAvailability,
  fetchUserAvailabilityForDate,
  fetchUserAvailabilityForWeek,
  fetchUserAvailabilityForUsers,
  createAvailabilitySlot,
  updateAvailabilitySlot,
  deleteAvailabilitySlot,
  copyDayAvailability
} from '@/services/userAvailabilityService';
import { transformAvailabilityData } from '@/hooks/availability/availabilityTransforms';
import { DayAvailability } from '@/hooks/availability/types';
import { useToast } from './use-toast';

// Re-export the type to avoid import issues
export type { DayAvailability };

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

  // Add a new availability slot
  const addSlot = useCallback(async (dayOfWeek: number, startTime: string, endTime: string, category: string = 'Session') => {
    if (!userId) {
      toast({
        title: "Error",
        description: "No user selected. Please select a user first.",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      console.log(`Creating slot for user ${userId}, day ${dayOfWeek}: ${startTime}-${endTime}, category=${category}`);
      const result = await createAvailabilitySlot(userId, dayOfWeek, startTime, endTime, category);
      
      if (result) {
        await refreshAvailability();
        toast({
          title: "Availability added",
          description: `Added availability for day ${dayOfWeek} from ${startTime} to ${endTime}`,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error adding availability slot:", error);
      toast({
        title: "Failed to add availability",
        description: "There was an error adding availability",
        variant: "destructive"
      });
      return false;
    }
  }, [userId, refreshAvailability, toast]);

  // Update an existing availability slot
  const updateSlot = useCallback(async (id: string, startTime: string, endTime: string, category: string) => {
    try {
      const success = await updateAvailabilitySlot(id, startTime, endTime, category);
      if (success) {
        await refreshAvailability();
        toast({
          title: "Availability updated",
          description: "Your availability has been updated successfully"
        });
      }
      return success;
    } catch (error) {
      console.error("Error updating availability slot:", error);
      toast({
        title: "Failed to update availability",
        description: "There was an error updating your availability",
        variant: "destructive"
      });
      return false;
    }
  }, [refreshAvailability, toast]);

  // Delete an availability slot
  const deleteSlot = useCallback(async (id: string) => {
    try {
      const success = await deleteAvailabilitySlot(id);
      if (success) {
        await refreshAvailability();
        toast({
          title: "Availability removed",
          description: "The availability slot has been removed"
        });
      }
      return success;
    } catch (error) {
      console.error("Error deleting availability slot:", error);
      toast({
        title: "Failed to delete availability",
        description: "There was an error deleting the availability slot",
        variant: "destructive"
      });
      return false;
    }
  }, [refreshAvailability, toast]);

  // Copy slots from one day to another
  const copyDaySlots = useCallback(async (fromDay: number, toDay: number) => {
    if (!userId) return false;
    
    try {
      const success = await copyDayAvailability(userId, fromDay, toDay);
      if (success) {
        await refreshAvailability();
        toast({
          title: "Availability copied",
          description: `Copied availability from day ${fromDay} to day ${toDay}`
        });
      } else {
        toast({
          title: "Nothing to copy",
          description: `No availability slots found for day ${fromDay}`
        });
      }
      return success;
    } catch (error) {
      console.error("Error copying day availability:", error);
      toast({
        title: "Failed to copy availability",
        description: "There was an error copying the availability",
        variant: "destructive"
      });
      return false;
    }
  }, [userId, refreshAvailability, toast]);
  
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
