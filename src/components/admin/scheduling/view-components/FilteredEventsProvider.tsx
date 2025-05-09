
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CalendarEvent } from '../context/calendarTypes';
import { useCalendar } from '../context/CalendarContext';

interface FilteredEventsContextType {
  filteredEvents: CalendarEvent[];
  filterType: string | null;
  setFilterType: (type: string | null) => void;
  selectedFilter: string | null;
  setSelectedFilter: (id: string | null) => void;
  selectedFilters: string[];
  setSelectedFilters: (ids: string[]) => void;
}

const FilteredEventsContext = createContext<FilteredEventsContextType | undefined>(undefined);

interface FilteredEventsProviderProps {
  children: React.ReactNode;
  filterType?: 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | null;
  filterId?: string | null;
  filterIds?: string[];
}

export const FilteredEventsProvider: React.FC<FilteredEventsProviderProps> = ({
  children,
  filterType: initialFilterType = null,
  filterId = null,
  filterIds = []
}) => {
  const { events } = useCalendar();
  const [filterType, setFilterType] = useState<string | null>(initialFilterType);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(filterId);
  const [selectedFilters, setSelectedFilters] = useState<string[]>(filterIds);
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>(events);
  
  // Apply filters when events, filter type, or selected filters change
  useEffect(() => {
    // For now, we're just passing through the events
    // In a real implementation, this would filter based on the criteria
    setFilteredEvents(events);
  }, [events, filterType, selectedFilter, selectedFilters]);
  
  const value = {
    filteredEvents,
    filterType,
    setFilterType,
    selectedFilter,
    setSelectedFilter,
    selectedFilters,
    setSelectedFilters
  };
  
  return (
    <FilteredEventsContext.Provider value={value}>
      {children}
    </FilteredEventsContext.Provider>
  );
};

export const useFilteredEvents = () => {
  const context = useContext(FilteredEventsContext);
  if (context === undefined) {
    throw new Error('useFilteredEvents must be used within a FilteredEventsProvider');
  }
  return context;
};
