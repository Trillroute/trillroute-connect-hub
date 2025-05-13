
import { useCallback } from 'react';
import { 
  createAvailabilitySlot,
  updateAvailabilitySlot,
  deleteAvailabilitySlot,
  copyDayAvailability
} from '@/services/userAvailabilityService';
import { type Toast } from '@/hooks/use-toast';

// Hook for CRUD operations on availability slots
export const useAvailabilityOperations = (
  userId: string | undefined, 
  refreshAvailability: () => Promise<any>,
  toastService: { toast: (props: any) => void }
) => {
  // Add a new availability slot
  const addSlot = useCallback(async (dayOfWeek: number, startTime: string, endTime: string, category: string = 'Session') => {
    if (!userId) {
      toastService.toast({
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
        toastService.toast({
          title: "Availability added",
          description: `Added availability for day ${dayOfWeek} from ${startTime} to ${endTime}`,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error adding availability slot:", error);
      toastService.toast({
        title: "Failed to add availability",
        description: "There was an error adding availability",
        variant: "destructive"
      });
      return false;
    }
  }, [userId, refreshAvailability, toastService]);

  // Update an existing availability slot
  const updateSlot = useCallback(async (id: string, startTime: string, endTime: string, category: string) => {
    try {
      const success = await updateAvailabilitySlot(id, startTime, endTime, category);
      if (success) {
        await refreshAvailability();
        toastService.toast({
          title: "Availability updated",
          description: "Your availability has been updated successfully"
        });
      }
      return success;
    } catch (error) {
      console.error("Error updating availability slot:", error);
      toastService.toast({
        title: "Failed to update availability",
        description: "There was an error updating your availability",
        variant: "destructive"
      });
      return false;
    }
  }, [refreshAvailability, toastService]);

  // Delete an availability slot
  const deleteSlot = useCallback(async (id: string) => {
    try {
      const success = await deleteAvailabilitySlot(id);
      if (success) {
        await refreshAvailability();
        toastService.toast({
          title: "Availability removed",
          description: "The availability slot has been removed"
        });
      }
      return success;
    } catch (error) {
      console.error("Error deleting availability slot:", error);
      toastService.toast({
        title: "Failed to delete availability",
        description: "There was an error deleting the availability slot",
        variant: "destructive"
      });
      return false;
    }
  }, [refreshAvailability, toastService]);

  // Copy slots from one day to another
  const copyDaySlots = useCallback(async (fromDay: number, toDay: number) => {
    if (!userId) return false;
    
    try {
      const success = await copyDayAvailability(userId, fromDay, toDay);
      if (success) {
        await refreshAvailability();
        toastService.toast({
          title: "Availability copied",
          description: `Copied availability from day ${fromDay} to day ${toDay}`
        });
      } else {
        toastService.toast({
          title: "Nothing to copy",
          description: `No availability slots found for day ${fromDay}`
        });
      }
      return success;
    } catch (error) {
      console.error("Error copying day availability:", error);
      toastService.toast({
        title: "Failed to copy availability",
        description: "There was an error copying the availability",
        variant: "destructive"
      });
      return false;
    }
  }, [userId, refreshAvailability, toastService]);

  return {
    addSlot,
    updateSlot,
    deleteSlot,
    copyDaySlots
  };
};
