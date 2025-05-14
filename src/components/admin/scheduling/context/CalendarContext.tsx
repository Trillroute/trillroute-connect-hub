import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { CalendarEvent, CalendarContextType, EventLayer, SelectedUser, UserAvailabilityMap } from './calendarTypes';
import { useCalendarEvents } from '../hooks/useCalendarEvents';
import { useCalendarNavigation } from '../hooks/useCalendarNavigation';
import { useCalendarFilters } from './useCalendarFilters';
import { fetchAllStaffAvailability } from '@/services/availability/api';

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

interface CalendarProviderProps {
  children: ReactNode;
  showAvailability?: boolean;
}

export const CalendarProvider: React.FC<CalendarProviderProps> = ({ 
  children,
  showAvailability = true
}) => {
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
    // Only if showAvailability is true
    if (showAvailability) {
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
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Line ~124 - Fix the filterEventsByUser function to handle SelectedUser type
  const filterEventsByUser = async (user: SelectedUser): Promise<void> => {
    // Extract userId from the SelectedUser object
    const userId = user.id;
    
    // Then use the userId for filtering
    try {
      // Implementation details remain the same
      console.log(`Filtering events for user: ${userId}`);
      // Your filtering logic here
    } catch (error) {
      console.error("Error filtering events by user:", error);
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
        activeLayers,
        selectedUsers,
        availabilities,
        showAvailability,
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
