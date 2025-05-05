
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { CalendarEvent, CalendarViewMode } from './types';
import { useCalendarEvents } from './hooks/useCalendarEvents';
import { useCalendarNavigation } from './hooks/useCalendarNavigation';

// Define layer types for filtering
export type EventLayer = 'teachers' | 'students' | 'admins' | 'superadmins';

interface CalendarContextType {
  currentDate: Date;
  viewMode: CalendarViewMode;
  events: CalendarEvent[];
  isCreateEventOpen: boolean;
  isLoading: boolean;
  activeLayers: EventLayer[];
  setCurrentDate: (date: Date) => void;
  setViewMode: (mode: CalendarViewMode) => void;
  setEvents: (events: CalendarEvent[]) => void;
  setIsCreateEventOpen: (open: boolean) => void;
  setActiveLayers: (layers: EventLayer[]) => void;
  toggleLayer: (layer: EventLayer) => void;
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
  
  // Toggle a specific layer on/off
  const toggleLayer = (layer: EventLayer) => {
    setActiveLayers(prev => 
      prev.includes(layer)
        ? prev.filter(l => l !== layer)
        : [...prev, layer]
    );
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
        setCurrentDate,
        setViewMode,
        setEvents,
        setIsCreateEventOpen,
        setActiveLayers,
        toggleLayer,
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
