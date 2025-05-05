
import { useState, useCallback } from 'react';
import { CalendarViewMode } from '../types';

export const useCalendarNavigation = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<CalendarViewMode>('day');

  // Navigation functions
  const goToToday = useCallback(() => setCurrentDate(new Date()), []);
  
  const goToPrevious = useCallback(() => {
    if (viewMode === 'day') {
      setCurrentDate(prev => new Date(prev.setDate(prev.getDate() - 1)));
    } else if (viewMode === 'week') {
      setCurrentDate(prev => new Date(prev.setDate(prev.getDate() - 7)));
    } else {
      setCurrentDate(prev => new Date(prev.setFullYear(prev.getFullYear(), prev.getMonth() - 1, 1)));
    }
  }, [viewMode]);
  
  const goToNext = useCallback(() => {
    if (viewMode === 'day') {
      setCurrentDate(prev => new Date(prev.setDate(prev.getDate() + 1)));
    } else if (viewMode === 'week') {
      setCurrentDate(prev => new Date(prev.setDate(prev.getDate() + 7)));
    } else {
      setCurrentDate(prev => new Date(prev.setFullYear(prev.getFullYear(), prev.getMonth() + 1, 1)));
    }
  }, [viewMode]);

  const handleDateSelect = useCallback((date: Date | undefined) => {
    if (date) {
      setCurrentDate(date);
    }
  }, []);

  return {
    currentDate,
    viewMode,
    setCurrentDate,
    setViewMode,
    goToToday,
    goToPrevious,
    goToNext,
    handleDateSelect,
  };
};
