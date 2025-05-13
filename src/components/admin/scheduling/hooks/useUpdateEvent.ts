
import { useState } from 'react';
import { useCalendar } from '../context/CalendarContext';
import { CalendarEvent } from '../context/calendarTypes';
import { useToast } from '@/hooks/use-toast';

export const useUpdateEvent = () => {
  const { handleUpdateEvent } = useCalendar();
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const updateEvent = async (eventId: string, eventData: Partial<Omit<CalendarEvent, 'id'>>) => {
    setIsUpdating(true);
    try {
      const success = await handleUpdateEvent(eventId, eventData);
      if (success) {
        toast({
          title: "Event updated",
          description: "Your event has been updated successfully"
        });
        return true;
      } else {
        toast({
          title: "Error updating event",
          description: "Could not update the event",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error updating event:", error);
      toast({
        title: "Error updating event",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
    return false;
  };

  return {
    updateEvent,
    isUpdating
  };
};
