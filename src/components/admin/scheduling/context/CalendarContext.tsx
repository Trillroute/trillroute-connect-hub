
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
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
    setViewMode: originalSetViewMode,
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
    filterEventsByUser: originalFilterEventsByUser
  } = useCalendarFilters(setEvents);

  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [availabilities, setAvailabilities] = useState<UserAvailabilityMap>({});
  
  // Create a wrapper for setViewMode that properly handles the type conversion
  const setViewMode = useCallback((mode: string) => {
    // Ensure we're passing a valid CalendarViewMode
    if (['day', 'week', 'month', 'list', 'legacy'].includes(mode)) {
      originalSetViewMode(mode as 'day' | 'week' | 'month' | 'list' | 'legacy');
    }
  }, [originalSetViewMode]);
  
  // Wrapper functions to ensure correct return types (Promise<void>)
  const handleCreateEvent = async (event: Omit<CalendarEvent, "id">): Promise<void> => {
    await originalCreateEvent(event);
    return;
  };
  
  const handleUpdateEvent = async (id: string, event: Omit<CalendarEvent, "id">): Promise<void> => {
    await originalUpdateEvent(id, event);
    return;
  };
  
  const handleDeleteEvent = async (id: string): Promise<void> => {
    await originalDeleteEvent(id);
    return;
  };
  
  // Wrapper for filterEventsByUser to match expected type
  const filterEventsByUser = (userId: string): void => {
    originalFilterEventsByUser(userId);
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
