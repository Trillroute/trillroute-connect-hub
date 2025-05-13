
import { useState } from 'react';
import { useCalendar } from '../context/CalendarContext';
import { useToast } from '@/hooks/use-toast';

export const useDeleteEvent = () => {
  const { handleDeleteEvent } = useCalendar();
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const deleteEvent = async (eventId: string) => {
    setIsDeleting(true);
    try {
      const success = await handleDeleteEvent(eventId);
      if (success) {
        toast({
          title: "Event deleted",
          description: "Your event has been deleted successfully"
        });
        return true;
      } else {
        toast({
          title: "Error deleting event",
          description: "Could not delete the event",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Error deleting event",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
    return false;
  };

  return {
    deleteEvent,
    isDeleting
  };
};
