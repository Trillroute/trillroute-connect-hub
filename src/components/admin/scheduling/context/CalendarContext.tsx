
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { CalendarEvent, CalendarContextType, EventLayer, SelectedUser, UserAvailabilityMap, CalendarViewMode } from './calendarTypes';
import { useCalendarEvents } from '../hooks/useCalendarEvents';
import { useCalendarNavigation } from '../hooks/useCalendarNavigation';
import { useCalendarFilters } from './useCalendarFilters';

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
  
  // Load events when component mounts
  useEffect(() => {
    refreshEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CalendarContext.Provider
      value={{
        events,
        isLoading,
        currentDate,
        viewMode,
        setViewMode,
        setCurrentDate,
        navigateToToday: goToToday,
        navigateNext: goToNext,
        navigatePrev: goToPrevious,
        refreshEvents,
        handleCreateEvent,
        handleUpdateEvent,
        handleDeleteEvent,
        availabilities,
        setAvailabilities,
        setEvents,
        // Add missing properties
        handleDateSelect,
        isCreateEventOpen,
        setIsCreateEventOpen,
        goToToday,
        goToPrevious,
        goToNext,
        // Add filter properties
        activeLayers,
        selectedUsers,
        setActiveLayers,
        setSelectedUsers,
        toggleLayer,
        toggleUser,
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
