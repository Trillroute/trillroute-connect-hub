
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { CalendarEvent, CalendarViewMode } from './types';
import { useCalendarEvents } from './hooks/useCalendarEvents';
import { useCalendarNavigation } from './hooks/useCalendarNavigation';
import { supabase } from '@/integrations/supabase/client';

// Define layer types for filtering
export type EventLayer = 'teachers' | 'students' | 'admins' | 'superadmins';

// Define user selection type
export type SelectedUser = {
  id: string;
  name: string;
  layer: EventLayer;
};

interface CalendarContextType {
  currentDate: Date;
  viewMode: CalendarViewMode;
  events: CalendarEvent[];
  isCreateEventOpen: boolean;
  isLoading: boolean;
  activeLayers: EventLayer[];
  selectedUsers: SelectedUser[];
  setCurrentDate: (date: Date) => void;
  setViewMode: (mode: CalendarViewMode) => void;
  setEvents: (events: CalendarEvent[]) => void;
  setIsCreateEventOpen: (open: boolean) => void;
  setActiveLayers: (layers: EventLayer[]) => void;
  setSelectedUsers: (users: SelectedUser[]) => void;
  toggleLayer: (layer: EventLayer) => void;
  toggleUser: (user: SelectedUser) => void;
  goToToday: () => void;
  goToPrevious: () => void;
  goToNext: () => void;
  handleCreateEvent: (eventData: Omit<CalendarEvent, 'id'>) => Promise<boolean>;
  handleUpdateEvent: (id: string, eventData: Omit<CalendarEvent, 'id'>) => Promise<boolean>;
  handleDeleteEvent: (id: string) => Promise<boolean>;
  handleDateSelect: (date: Date | undefined) => void;
  refreshEvents: () => Promise<void>;
  filterEventsByRole: (roles: string[]) => Promise<void>;
  filterEventsByUser: (userId: string) => Promise<void>;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    events,
    setEvents,
    isLoading,
    refreshEvents,
    handleCreateEvent,
    handleUpdateEvent,
    handleDeleteEvent,
  } = useCalendarEvents();

  const {
    currentDate,
    viewMode,
    setCurrentDate,
    setViewMode,
    goToToday,
    goToPrevious,
    goToNext,
    handleDateSelect,
  } = useCalendarNavigation();

  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  
  // Initialize with all layers active
  const [activeLayers, setActiveLayers] = useState<EventLayer[]>(['teachers', 'students', 'admins', 'superadmins']);
  
  // Initialize selectedUsers state
  const [selectedUsers, setSelectedUsers] = useState<SelectedUser[]>([]);
  
  // Toggle a specific layer on/off
  const toggleLayer = (layer: EventLayer) => {
    setActiveLayers(prev => 
      prev.includes(layer)
        ? prev.filter(l => l !== layer)
        : [...prev, layer]
    );
    
    // If layer is turned off, remove all users from that layer
    if (activeLayers.includes(layer)) {
      setSelectedUsers(prev => prev.filter(user => user.layer !== layer));
    }
  };
  
  // Toggle a specific user on/off
  const toggleUser = (user: SelectedUser) => {
    setSelectedUsers(prev => {
      const userExists = prev.some(u => u.id === user.id);
      
      if (userExists) {
        return prev.filter(u => u.id !== user.id);
      } else {
        return [...prev, user];
      }
    });
  };
  
  // Filter events by role
  const filterEventsByRole = async (roles: string[]) => {
    try {
      const { data, error } = await supabase
        .from('user_events')
        .select(`
          *,
          custom_users!user_id (first_name, last_name, role)
        `);
        
      if (error) {
        console.error("Error fetching events by role:", error);
        return;
      }
      
      // Filter events by user role
      const filteredEvents = data.filter(event => {
        const userRole = event.custom_users?.role;
        return userRole && roles.includes(userRole);
      });
      
      // Map to calendar events format
      const mappedEvents = filteredEvents.map(event => ({
        id: event.id,
        title: event.title,
        start: new Date(event.start_time),
        end: new Date(event.end_time),
        description: event.description,
        color: event.custom_users?.role === 'teacher' ? '#4f46e5' : 
               event.custom_users?.role === 'admin' ? '#0891b2' : 
               event.custom_users?.role === 'student' ? '#16a34a' : 
               event.custom_users?.role === 'superadmin' ? '#9333ea' : '#6b7280',
      }));
      
      setEvents(mappedEvents);
      
    } catch (err) {
      console.error("Failed to filter events by role:", err);
    }
  };
  
  // Filter events by user ID
  const filterEventsByUser = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_events')
        .select('*')
        .eq('user_id', userId);
        
      if (error) {
        console.error("Error fetching events for user:", error);
        return;
      }
      
      // Map to calendar events format
      const mappedEvents = data.map(event => ({
        id: event.id,
        title: event.title,
        start: new Date(event.start_time),
        end: new Date(event.end_time),
        description: event.description,
      }));
      
      setEvents(mappedEvents);
      
    } catch (err) {
      console.error("Failed to filter events by user:", err);
    }
  };
  
  // Load events when component mounts
  useEffect(() => {
    refreshEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CalendarContext.Provider
      value={{
        currentDate,
        viewMode,
        events,
        isCreateEventOpen,
        isLoading,
        activeLayers,
        selectedUsers,
        setCurrentDate,
        setViewMode,
        setEvents,
        setIsCreateEventOpen,
        setActiveLayers,
        setSelectedUsers,
        toggleLayer,
        toggleUser,
        goToToday,
        goToPrevious,
        goToNext,
        handleCreateEvent,
        handleUpdateEvent,
        handleDeleteEvent,
        handleDateSelect,
        refreshEvents,
        filterEventsByRole,
        filterEventsByUser,
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
