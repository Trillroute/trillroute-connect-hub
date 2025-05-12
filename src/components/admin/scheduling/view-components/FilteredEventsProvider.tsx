
import React, { useEffect } from 'react';
import { useCalendar } from '../context/CalendarContext';
import { useFilteredEventsData } from '../hooks/useFilteredEventsData';
import { applyFilter } from '../utils/filterUtils';

interface FilteredEventsProviderProps {
  children: React.ReactNode;
  filterType?: 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | null;
  filterId?: string | null;
  filterIds?: string[];
}

/**
 * Component that handles filtering events based on provided filter parameters
 */
export const FilteredEventsProvider: React.FC<FilteredEventsProviderProps> = ({
  children,
  filterType,
  filterId,
  filterIds = []
}) => {
  const { refreshEvents, setEvents, setAvailabilities } = useCalendar();
  
  // Use our custom hook to get staff user IDs and availability conversion utilities
  const { 
    staffUserIds, 
    convertAvailabilityMap 
  } = useFilteredEventsData({
    filterType,
    filterId,
    filterIds
  });

  // Apply filters when filter type or IDs change
  useEffect(() => {
    console.log("FilteredEventsProvider received:", { filterType, filterId, filterIds });
    
    if (!filterType) {
      console.log("No filterType specified, refreshing all events");
      refreshEvents();
      return;
    }

    // Apply the appropriate filter
    const applyFilters = async () => {
      // Make sure filterIds is an array
      const safeFilterIds = Array.isArray(filterIds) ? [...filterIds] : [];
      
      // If we have both filterIds array and a single filterId, combine them
      const ids = filterId 
        ? [...safeFilterIds, filterId].filter(Boolean) 
        : safeFilterIds.filter(Boolean);
      
      await applyFilter({
        filterType,
        ids,
        staffUserIds,
        setEvents,
        setAvailabilities,
        convertAvailabilityMap
      });
    };

    applyFilters();
  }, [filterType, filterId, filterIds, staffUserIds, refreshEvents, setEvents, setAvailabilities, convertAvailabilityMap]);

  return <>{children}</>;
};
