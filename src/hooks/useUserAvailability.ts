
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { 
  fetchUserAvailability, 
  createAvailabilitySlot, 
  updateAvailabilitySlot, 
  deleteAvailabilitySlot, 
  copyDayAvailability,
  UserAvailability 
} from '@/services/userAvailabilityService';

export interface DayAvailability {
  dayOfWeek: number;
  dayName: string;
  slots: UserAvailability[];
}

const daysOfWeek = [
  "Sunday",
  "Monday", 
  "Tuesday", 
  "Wednesday", 
  "Thursday", 
  "Friday", 
  "Saturday"
];

export function useUserAvailability(userId?: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [dailyAvailability, setDailyAvailability] = useState<DayAvailability[]>([]);
  
  const targetUserId = userId || (user ? user.id : '');

  const refreshAvailability = useCallback(async () => {
    if (!targetUserId) {
      setDailyAvailability([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const availability = await fetchUserAvailability(targetUserId);
      
      // Organize by day of week
      const availabilityByDay: Record<number, UserAvailability[]> = {};
      
      // Initialize all days
      for (let i = 0; i < 7; i++) {
        availabilityByDay[i] = [];
      }
      
      // Group slots by day
      availability.forEach(slot => {
        if (!availabilityByDay[slot.dayOfWeek]) {
          availabilityByDay[slot.dayOfWeek] = [];
        }
        availabilityByDay[slot.dayOfWeek].push(slot);
      });
      
      // Convert to array format
      const result: DayAvailability[] = Object.keys(availabilityByDay).map(day => {
        const dayIndex = parseInt(day);
        return {
          dayOfWeek: dayIndex,
          dayName: daysOfWeek[dayIndex],
          slots: availabilityByDay[dayIndex].sort((a, b) => {
            return a.startTime.localeCompare(b.startTime);
          })
        };
      }).sort((a, b) => a.dayOfWeek - b.dayOfWeek);
      
      setDailyAvailability(result);
    } catch (error) {
      console.error("Error refreshing availability:", error);
      toast({
        title: "Failed to load availability",
        description: "There was an error loading your availability schedule",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [targetUserId, toast]);

  const addSlot = async (dayOfWeek: number, startTime: string, endTime: string) => {
    if (!targetUserId) return false;
    
    try {
      const result = await createAvailabilitySlot(targetUserId, dayOfWeek, startTime, endTime);
      if (result) {
        await refreshAvailability();
        toast({
          title: "Availability added",
          description: `Added availability for ${daysOfWeek[dayOfWeek]} from ${startTime} to ${endTime}`,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error adding availability slot:", error);
      toast({
        title: "Failed to add availability",
        description: "There was an error adding your availability",
        variant: "destructive"
      });
      return false;
    }
  };

  const updateSlot = async (id: string, startTime: string, endTime: string) => {
    try {
      const success = await updateAvailabilitySlot(id, startTime, endTime);
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
  };

  const deleteSlot = async (id: string) => {
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
  };

  const copyDaySlots = async (fromDay: number, toDay: number) => {
    if (!targetUserId) return false;
    
    try {
      const success = await copyDayAvailability(targetUserId, fromDay, toDay);
      if (success) {
        await refreshAvailability();
        toast({
          title: "Availability copied",
          description: `Copied availability from ${daysOfWeek[fromDay]} to ${daysOfWeek[toDay]}`
        });
      } else {
        toast({
          title: "Nothing to copy",
          description: `No availability slots found for ${daysOfWeek[fromDay]}`
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
  };

  useEffect(() => {
    if (targetUserId) {
      refreshAvailability();
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
