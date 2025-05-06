
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
      console.log('Cannot refresh availability: No user ID provided');
      // Create empty availability data structure for each day of the week
      const emptyAvailability = daysOfWeek.map((dayName, index) => ({
        dayOfWeek: index,
        dayName,
        slots: []
      }));
      setDailyAvailability(emptyAvailability);
      return;
    }

    try {
      console.log(`Fetching availability for user: ${userId}`);
      const availability = await fetchUserAvailability(userId);
      console.log(`Retrieved availability data for ${userId}:`, availability);
      const transformed = transformAvailabilityData(availability);
      console.log('Transformed availability data:', transformed);
      setDailyAvailability(transformed);
      // Return void instead of the transformed data to match the type signature
      return;
    } catch (error) {
      console.error("Error refreshing availability:", error);
      toast({
        title: "Failed to load availability",
        description: "There was an error loading your availability schedule",
        variant: "destructive"
      });
      // Still provide an empty structure so the UI can render
      const emptyAvailability = daysOfWeek.map((dayName, index) => ({
        dayOfWeek: index,
        dayName,
        slots: []
      }));
      setDailyAvailability(emptyAvailability);
      throw error;
    }
  };

  const addSlot = async (dayOfWeek: number, startTime: string, endTime: string) => {
    if (!userId) return false;
    
    try {
      setLoading(true);
      const result = await createAvailabilitySlot(userId, dayOfWeek, startTime, endTime);
      if (result) {
        await refreshAvailability();
        toast({
          title: "Availability added",
          description: `Added availability for ${daysOfWeek[dayOfWeek]} from ${startTime} to ${endTime}`,
        });
        return true;
      }
      setLoading(false);
      return false;
    } catch (error) {
      console.error("Error adding availability slot:", error);
      toast({
        title: "Failed to add availability",
        description: "There was an error adding your availability",
        variant: "destructive"
      });
      setLoading(false);
      return false;
    }
  };

  const updateSlot = async (id: string, startTime: string, endTime: string) => {
    try {
      setLoading(true);
      const success = await updateAvailabilitySlot(id, startTime, endTime);
      if (success) {
        await refreshAvailability();
        toast({
          title: "Availability updated",
          description: "Your availability has been updated successfully"
        });
      } else {
        setLoading(false);
      }
      return success;
    } catch (error) {
      console.error("Error updating availability slot:", error);
      toast({
        title: "Failed to update availability",
        description: "There was an error updating your availability",
        variant: "destructive"
      });
      setLoading(false);
      return false;
    }
  };

  const deleteSlot = async (id: string) => {
    try {
      setLoading(true);
      const success = await deleteAvailabilitySlot(id);
      if (success) {
        await refreshAvailability();
        toast({
          title: "Availability removed",
          description: "The availability slot has been removed"
        });
      } else {
        setLoading(false);
      }
      return success;
    } catch (error) {
      console.error("Error deleting availability slot:", error);
      toast({
        title: "Failed to delete availability",
        description: "There was an error deleting the availability slot",
        variant: "destructive"
      });
      setLoading(false);
      return false;
    }
  };

  const copyDaySlots = async (fromDay: number, toDay: number) => {
    if (!userId) return false;
    
    try {
      setLoading(true);
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
        setLoading(false);
      }
      return success;
    } catch (error) {
      console.error("Error copying day availability:", error);
      toast({
        title: "Failed to copy availability",
        description: "There was an error copying the availability",
        variant: "destructive"
      });
      setLoading(false);
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
