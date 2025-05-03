
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { CalendarEvent } from './types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { fetchEvents, createEvent, updateEvent, deleteEvent } from '@/services/calendarService';

interface CalendarContextType {
  currentDate: Date;
  viewMode: 'day' | 'week' | 'month';
  events: CalendarEvent[];
  isCreateEventOpen: boolean;
  isLoading: boolean;
  setCurrentDate: (date: Date) => void;
  setViewMode: (mode: 'day' | 'week' | 'month') => void;
  setEvents: (events: CalendarEvent[]) => void;
  setIsCreateEventOpen: (open: boolean) => void;
  goToToday: () => void;
  goToPrevious: () => void;
  goToNext: () => void;
  handleCreateEvent: (eventData: Omit<CalendarEvent, 'id'>) => void;
  handleUpdateEvent: (id: string, eventData: Omit<CalendarEvent, 'id'>) => void;
  handleDeleteEvent: (id: string) => void;
  handleDateSelect: (date: Date | undefined) => void;
  refreshEvents: () => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch events from database
  const refreshEvents = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const fetchedEvents = await fetchEvents(user.id);
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
  };

  // Load events when component mounts or user changes
  useEffect(() => {
    refreshEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Navigation functions
  const goToToday = () => setCurrentDate(new Date());
  
  const goToPrevious = () => {
    if (viewMode === 'day') {
      setCurrentDate(prev => new Date(prev.setDate(prev.getDate() - 1)));
    } else if (viewMode === 'week') {
      setCurrentDate(prev => new Date(prev.setDate(prev.getDate() - 7)));
    } else {
      setCurrentDate(prev => new Date(prev.setFullYear(prev.getFullYear(), prev.getMonth() - 1, 1)));
    }
  };
  
  const goToNext = () => {
    if (viewMode === 'day') {
      setCurrentDate(prev => new Date(prev.setDate(prev.getDate() + 1)));
    } else if (viewMode === 'week') {
      setCurrentDate(prev => new Date(prev.setDate(prev.getDate() + 7)));
    } else {
      setCurrentDate(prev => new Date(prev.setFullYear(prev.getFullYear(), prev.getMonth() + 1, 1)));
    }
  };

  // Event handlers
  const handleCreateEvent = async (eventData: Omit<CalendarEvent, 'id'>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create events",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const newEvent = await createEvent(eventData, user.id);
      if (newEvent) {
        setEvents(prev => [...prev, newEvent]);
        setIsCreateEventOpen(false);
        toast({
          title: "Event created",
          description: `"${eventData.title}" has been added to your calendar.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error creating event",
        description: "Could not save your event",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateEvent = async (id: string, eventData: Omit<CalendarEvent, 'id'>) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const updatedEvent = await updateEvent(id, eventData, user.id);
      if (updatedEvent) {
        setEvents(prev => prev.map(event => event.id === id ? updatedEvent : event));
        toast({
          title: "Event updated",
          description: `"${eventData.title}" has been updated.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error updating event",
        description: "Could not update your event",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const success = await deleteEvent(id, user.id);
      if (success) {
        setEvents(prev => prev.filter(event => event.id !== id));
        toast({
          title: "Event deleted",
          description: "Event has been removed from your calendar.",
        });
      }
    } catch (error) {
      toast({
        title: "Error deleting event",
        description: "Could not delete your event",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setCurrentDate(date);
    }
  };

  return (
    <CalendarContext.Provider
      value={{
        currentDate,
        viewMode,
        events,
        isCreateEventOpen,
        isLoading,
        setCurrentDate,
        setViewMode,
        setEvents,
        setIsCreateEventOpen,
        goToToday,
        goToPrevious,
        goToNext,
        handleCreateEvent,
        handleUpdateEvent,
        handleDeleteEvent,
        handleDateSelect,
        refreshEvents,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};
