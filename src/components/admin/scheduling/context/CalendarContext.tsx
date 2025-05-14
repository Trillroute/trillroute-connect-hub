import React, { createContext, useState, useContext, ReactNode } from 'react';
import { CalendarEvent, UserAvailabilityMap } from './calendarTypes';
import { useCalendarEvents } from '../hooks/useCalendarEvents';
import { useCalendarNavigation } from '../hooks/useCalendarNavigation';
import { useCalendarFilters } from './useCalendarFilters';
import { fetchAllStaffAvailability } from '@/services/availability/api';

// Update the CalendarContextType interface
interface CalendarContextType {
  currentDate: string;
  viewMode: string;
  events: CalendarEvent[];
  isCreateEventOpen: boolean;
  isLoading: boolean;
  activeLayers: EventLayer[];
  selectedUsers: SelectedUser[];
  availabilities: UserAvailabilityMap;
  setCurrentDate: (date: string) => void;
  setViewMode: (mode: string) => void;
  setEvents: (events: CalendarEvent[]) => void;
  setIsCreateEventOpen: (open: boolean) => void;
  setActiveLayers: (layers: EventLayer[]) => void;
  setSelectedUsers: (users: SelectedUser[]) => void;
  setAvailabilities: (availabilities: UserAvailabilityMap) => void;
  toggleLayer: (layer: EventLayer) => void;
  toggleUser: (user: SelectedUser) => void;
  goToToday: () => void;
  goToPrevious: () => void;
  goToNext: () => void;
  handleCreateEvent: (event: any) => Promise<void>;
  handleUpdateEvent: (id: string, event: any) => Promise<void>;
  handleDeleteEvent: (id: string) => Promise<void>;
  handleDateSelect: (date: string) => void;
  refreshEvents: () => void;
  filterEventsByRole: (role: string) => void;
  filterEventsByUser: (user: SelectedUser) => void;
  showAvailability: boolean; // New property to control availability display
}

// Default context
const defaultContextValue: CalendarContextType = {
  currentDate: '',
  viewMode: '',
  events: [],
  isCreateEventOpen: false,
  isLoading: false,
  activeLayers: [],
  selectedUsers: [],
  availabilities: {},
  setCurrentDate: () => {},
  setViewMode: () => {},
  setEvents: () => {},
  setIsCreateEventOpen: () => {},
  setActiveLayers: () => {},
  setSelectedUsers: () => {},
  setAvailabilities: () => {},
  toggleLayer: () => {},
  toggleUser: () => {},
  goToToday: () => {},
  goToPrevious: () => {},
  goToNext: () => {},
  handleCreateEvent: () => Promise.resolve(),
  handleUpdateEvent: () => Promise.resolve(),
  handleDeleteEvent: () => Promise.resolve(),
  handleDateSelect: () => {},
  refreshEvents: () => {},
  filterEventsByRole: () => {},
  filterEventsByUser: () => {},
  showAvailability: true, // Default to showing availability
};

// Create context
const CalendarContext = createContext<CalendarContextType>(defaultContextValue);

export const CalendarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    events,
    setEvents,
    isLoading,
    refreshEvents,
    handleCreateEvent: originalCreateEvent,
    handleUpdateEvent: originalUpdateEvent,
    handleDeleteEvent: originalDeleteEvent,
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

  const {
    activeLayers,
    selectedUsers,
    setActiveLayers,
    setSelectedUsers,
    toggleLayer,
    toggleUser,
    filterEventsByRole,
    filterEventsByUser
  } = useCalendarFilters(setEvents);

  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [availabilities, setAvailabilities] = useState<UserAvailabilityMap>({});
  
  // Wrapper functions to ensure correct return types (Promise<void>)
  const handleCreateEvent = async (event: any): Promise<void> => {
    await originalCreateEvent(event);
    return;
  };
  
  const handleUpdateEvent = async (id: string, event: any): Promise<void> => {
    await originalUpdateEvent(id, event);
    return;
  };
  
  const handleDeleteEvent = async (id: string): Promise<void> => {
    await originalDeleteEvent(id);
    return;
  };
  
  // Load events and availabilities when component mounts
  useEffect(() => {
    refreshEvents();
    
    // Load staff availabilities - this will populate the availabilities state
    const loadAvailabilities = async () => {
      try {
        const availabilityData = await fetchAllStaffAvailability();
        console.log('Loaded availability data:', Object.keys(availabilityData).length, 'users');
        setAvailabilities(availabilityData);
      } catch (error) {
        console.error('Failed to load availabilities:', error);
      }
    };
    
    loadAvailabilities();
    
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
        availabilities,
        setCurrentDate,
        setViewMode,
        setEvents,
        setIsCreateEventOpen,
        setActiveLayers,
        setSelectedUsers,
        setAvailabilities,
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
        showAvailability,
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

export default CalendarContext;
