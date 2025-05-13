
import { useState, useCallback } from 'react';
import { CalendarEvent } from '../context/calendarTypes';
import { fetchEvents, createEvent, updateEvent, deleteEvent } from '@/services/calendar';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export const useCalendarEvents = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const refreshEvents = useCallback(async () => {
    if (!user?.id) {
      console.log("No user ID available for fetching events");
      return;
    }
    
    setIsLoading(true);
    try {
      console.log(`Fetching events for user ${user.id} with role ${user.role}`);
      const data = await fetchEvents(user.id, user.role);
      console.log(`Received ${data.length} events from API`);
      setEvents(data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      toast({
        title: 'Error',
        description: 'Failed to load calendar events',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  const handleCreateEvent = useCallback(async (eventData: Omit<CalendarEvent, 'id'>) => {
    if (!user?.id) return null;
    
    setIsLoading(true);
    try {
      console.log('Creating new event:', eventData);
      const createdEvent = await createEvent(eventData, user.id, user);
      
      if (createdEvent) {
        console.log('Event created successfully:', createdEvent);
        // Add the new event to the list
        setEvents(prev => [...prev, createdEvent]);
        return createdEvent.id;
      }
    } catch (error) {
      console.error('Failed to create event:', error);
      toast({
        title: 'Error',
        description: 'Failed to create event',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
    return null;
  }, [user, toast]);

  const handleUpdateEvent = useCallback(async (id: string, eventData: Partial<Omit<CalendarEvent, 'id'>>) => {
    if (!user?.id) return false;
    
    setIsLoading(true);
    try {
      console.log(`Updating event ${id}:`, eventData);
      
      // Get the full event
      const existingEvent = events.find(e => e.id === id);
      if (!existingEvent) {
        console.error(`Event ${id} not found`);
        return false;
      }
      
      // Merge with existing data
      const fullEventData = {
        ...existingEvent,
        ...eventData,
      };
      
      // Remove the id as it's not needed in the update payload
      const { id: _, ...updatePayload } = fullEventData;
      
      const updatedEvent = await updateEvent(id, updatePayload as Omit<CalendarEvent, 'id'>, user.id, user);
      
      if (updatedEvent) {
        console.log('Event updated successfully:', updatedEvent);
        // Update the event in the list
        setEvents(prev => prev.map(e => e.id === id ? updatedEvent : e));
        return true;
      }
    } catch (error) {
      console.error('Failed to update event:', error);
      toast({
        title: 'Error',
        description: 'Failed to update event',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
    return false;
  }, [events, user, toast]);

  const handleDeleteEvent = useCallback(async (id: string) => {
    if (!user?.id) return false;
    
    setIsLoading(true);
    try {
      console.log(`Deleting event ${id}`);
      const success = await deleteEvent(id, user.id, user);
      
      if (success) {
        console.log('Event deleted successfully');
        // Remove the event from the list
        setEvents(prev => prev.filter(e => e.id !== id));
        return true;
      }
    } catch (error) {
      console.error('Failed to delete event:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete event',
        variant: 'destructive',
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
