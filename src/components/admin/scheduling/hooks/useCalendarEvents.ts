import { useState, useCallback } from 'react';
import { CalendarEvent } from '../types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { 
  fetchEvents, 
  createEvent, 
  updateEvent, 
  deleteEvent 
} from '@/services/calendar';

export const useCalendarEvents = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, role } = useAuth();

  // Fetch events from database
  const refreshEvents = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const fetchedEvents = await fetchEvents(user.id, role);
      setEvents(fetchedEvents);
    } catch (error) {
      toast({
        title: "Error fetching events",
        description: "Could not load your calendar events",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast, role]);

  // Event handlers
  const handleCreateEvent = useCallback(async (eventData: Omit<CalendarEvent, 'id'>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create events",
        variant: "destructive"
      });
      return false;
    }

    setIsLoading(true);
    try {
      // Pass the full user object to check permissions
      const newEvent = await createEvent(eventData, user.id, user);
      if (newEvent) {
        setEvents(prev => [...prev, newEvent]);
        toast({
          title: "Event created",
          description: `"${eventData.title}" has been added to your calendar.`,
        });
        return true;
      }
    } catch (error: any) {
      toast({
        title: "Error creating event",
        description: error.message || "Could not save your event",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
    return false;
  }, [user, toast]);

  const handleUpdateEvent = useCallback(async (id: string, eventData: Omit<CalendarEvent, 'id'>) => {
    if (!user) return false;
    
    setIsLoading(true);
    try {
      // Pass the full user object to check permissions
      const updatedEvent = await updateEvent(id, eventData, user.id, user);
      if (updatedEvent) {
        setEvents(prev => prev.map(event => event.id === id ? updatedEvent : event));
        toast({
          title: "Event updated",
          description: `"${eventData.title}" has been updated.`,
        });
        return true;
      }
    } catch (error: any) {
      toast({
        title: "Error updating event",
        description: error.message || "Could not update your event",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
    return false;
  }, [user, toast]);

  const handleDeleteEvent = useCallback(async (id: string) => {
    if (!user) return false;
    
    setIsLoading(true);
    try {
      // Pass the full user object to check permissions
      const success = await deleteEvent(id, user.id, user);
      if (success) {
        setEvents(prev => prev.filter(event => event.id !== id));
        toast({
          title: "Event deleted",
          description: "Event has been removed from your calendar.",
        });
        return true;
      }
    } catch (error: any) {
      toast({
        title: "Error deleting event",
        description: error.message || "Could not delete your event",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
    return false;
  }, [user, toast]);

  return {
    events,
    setEvents,
    isLoading,
    refreshEvents,
    handleCreateEvent,
    handleUpdateEvent,
    handleDeleteEvent,
  };
};
