
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { CalendarEvent, CalendarViewMode } from './types';
import { useCalendarEvents } from './hooks/useCalendarEvents';
import { useCalendarNavigation } from './hooks/useCalendarNavigation';

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
