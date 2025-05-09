
import React from 'react';
import { useCalendar } from '../context/CalendarContext';
import { useEventFilterData } from '../hooks/useEventFilterData';
import { useApplyEventFilters } from '../hooks/useApplyEventFilters';

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
  
  // Get user IDs based on filter types
  const { staffUserIds } = useEventFilterData(filterType, filterId, filterIds);
  
  // Apply filters to get events and availabilities
  useApplyEventFilters(
    filterType,
    filterId,
    filterIds,
    staffUserIds,
    refreshEvents,
    setEvents,
    setAvailabilities
  );

  return <>{children}</>;
};
