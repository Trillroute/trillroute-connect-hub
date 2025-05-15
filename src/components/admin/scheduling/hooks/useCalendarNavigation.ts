
import { useState, useCallback } from 'react';

export type CalendarViewMode = 'day' | 'week' | 'month' | 'list' | 'legacy';

export const useCalendarNavigation = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<CalendarViewMode>('week');

  // Navigation functions
  const goToToday = useCallback(() => setCurrentDate(new Date()), []);
  
  const goToPrevious = useCallback(() => {
    if (viewMode === 'day') {
      setCurrentDate(prev => new Date(prev.setDate(prev.getDate() - 1)));
    } else if (viewMode === 'week') {
      setCurrentDate(prev => new Date(prev.setDate(prev.getDate() - 7)));
    } else if (viewMode === 'month') {
      setCurrentDate(prev => new Date(prev.setFullYear(prev.getFullYear(), prev.getMonth() - 1, 1)));
    }
    // For list view and legacy view, we don't change the date as they show events across all dates
  }, [viewMode]);
  
  const goToNext = useCallback(() => {
    if (viewMode === 'day') {
      setCurrentDate(prev => new Date(prev.setDate(prev.getDate() + 1)));
    } else if (viewMode === 'week') {
      setCurrentDate(prev => new Date(prev.setDate(prev.getDate() + 7)));
    } else if (viewMode === 'month') {
      setCurrentDate(prev => new Date(prev.setFullYear(prev.getFullYear(), prev.getMonth() + 1, 1)));
    }
    // For list view and legacy view, we don't change the date as they show events across all dates
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
