
import { useState } from 'react';
import { useCalendar } from '../context/CalendarContext';
import { CalendarEvent } from '../context/calendarTypes';
import { useToast } from '@/hooks/use-toast';

export const useCreateEvent = () => {
  const { handleCreateEvent } = useCalendar();
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const createEvent = async (eventData: Omit<CalendarEvent, 'id'>) => {
    setIsCreating(true);
    try {
      const eventId = await handleCreateEvent(eventData);
      if (eventId) {
        toast({
          title: "Event created",
          description: "Your event has been created successfully"
        });
        return eventId;
      } else {
        toast({
          title: "Error creating event",
          description: "Could not create the event",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Error creating event",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
    return null;
  };

  return {
    createEvent,
    isCreating
  };
};
