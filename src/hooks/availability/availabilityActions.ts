
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
      setDailyAvailability([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      console.log('Fetching availability for user:', userId);
      const availability = await fetchUserAvailability(userId);
      console.log('Retrieved availability data:', availability);
      const transformed = transformAvailabilityData(availability);
      console.log('Transformed availability data:', transformed);
      setDailyAvailability(transformed);
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
  };

  const addSlot = async (dayOfWeek: number, startTime: string, endTime: string) => {
    if (!userId) return false;
    
    try {
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
