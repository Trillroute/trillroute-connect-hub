
import { useToast } from '@/hooks/use-toast';
import { 
  createAvailabilitySlot,
  updateAvailabilitySlot,
  deleteAvailabilitySlot,
  copyDayAvailability,
  fetchUserAvailability
} from '@/services/userAvailabilityService';
import { daysOfWeek } from './dayUtils';
import { transformAvailabilityData } from './availabilityTransforms';
import { UseAvailabilityActions, DayAvailability } from './types';

export function useAvailabilityActions(
  userId: string, 
  setLoading: (loading: boolean) => void,
  setDailyAvailability: (availability: DayAvailability[]) => void
): UseAvailabilityActions {
  const { toast } = useToast();
  
  const refreshAvailability = async () => {
    if (!userId) {
      console.warn('Cannot refresh availability: No user ID provided');
      // Create empty availability data structure for each day of the week
      const emptyAvailability = daysOfWeek.map((dayName, index) => ({
        dayOfWeek: index,
        dayName,
        slots: []
      }));
      setDailyAvailability(emptyAvailability);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log(`Fetching availability for user: ${userId}`);
      const availability = await fetchUserAvailability(userId);
      console.log(`Retrieved availability data:`, availability);
      
      const transformed = transformAvailabilityData(availability);
      setDailyAvailability(transformed);
    } catch (error) {
      console.error("Error refreshing availability:", error);
      toast({
        title: "Failed to load availability",
        description: "There was an error loading the availability schedule",
        variant: "destructive"
      });
      // Still provide an empty structure so the UI can render
      const emptyAvailability = daysOfWeek.map((dayName, index) => ({
        dayOfWeek: index,
        dayName,
        slots: []
      }));
      setDailyAvailability(emptyAvailability);
    } finally {
      setLoading(false);
    }
  };

  const addSlot = async (dayOfWeek: number, startTime: string, endTime: string) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "No user selected. Please select a user first.",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      console.log(`Creating slot for user ${userId}, day ${dayOfWeek}: ${startTime}-${endTime}`);
      const result = await createAvailabilitySlot(userId, dayOfWeek, startTime, endTime);
      
      if (result) {
        await refreshAvailability();
        toast({
          title: "Availability added",
          description: `Added availability for ${daysOfWeek[dayOfWeek]} from ${startTime} to ${endTime}`,
        });
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("Error adding availability slot:", error);
      toast({
        title: "Failed to add availability",
        description: "There was an error adding availability",
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
    if (!userId) return false;
    
    try {
      const success = await copyDayAvailability(userId, fromDay, toDay);
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

  return {
    refreshAvailability,
    addSlot,
    updateSlot,
    deleteSlot,
    copyDaySlots,
  };
}
