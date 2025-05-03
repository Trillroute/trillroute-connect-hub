
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { CalendarEvent } from './types';

interface CalendarContextType {
  currentDate: Date;
  viewMode: 'day' | 'week' | 'month';
  events: CalendarEvent[];
  isCreateEventOpen: boolean;
  setCurrentDate: (date: Date) => void;
  setViewMode: (mode: 'day' | 'week' | 'month') => void;
  setEvents: (events: CalendarEvent[]) => void;
  setIsCreateEventOpen: (open: boolean) => void;
  goToToday: () => void;
  goToPrevious: () => void;
  goToNext: () => void;
  handleCreateEvent: (eventData: Omit<CalendarEvent, 'id'>) => void;
  handleDateSelect: (date: Date | undefined) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);

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
  const handleCreateEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: `event-${Date.now()}`,
    };
    
    setEvents(prev => [...prev, newEvent]);
    setIsCreateEventOpen(false);
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
        setCurrentDate,
        setViewMode,
        setEvents,
        setIsCreateEventOpen,
        goToToday,
        goToPrevious,
        goToNext,
        handleCreateEvent,
        handleDateSelect,
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
