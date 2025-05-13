
import { useMemo } from 'react';
import { useCalendar } from '../context/CalendarContext';
import { useStaffFetcher } from './useStaffFetcher';
import { useEventFetching } from './useEventFetching';

interface UseFilteredEventsProps {
  filterType?: 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | null;
  filterId?: string | null;
  filterIds?: string[];
}

/**
 * Main hook for filtering events based on different criteria
 */
export const useFilteredEvents = ({
  filterType,
  filterId,
  filterIds = []
}: UseFilteredEventsProps = {}) => {
  const { refreshEvents } = useCalendar();
  
  // Combine filterId and filterIds for consistent handling
  const allFilterIds = useMemo(() => {
    return filterId 
      ? [...filterIds.filter(Boolean), filterId].filter(Boolean) 
      : filterIds.filter(Boolean);
  }, [filterId, filterIds]);
  
  // Get staff IDs based on filter type and filter IDs
  const { staffUserIds, isLoading: isStaffLoading } = useStaffFetcher({ 
    filterType, 
    filterIds: allFilterIds 
  });
  
  // Fetch events and availabilities based on filters
  const { events, isLoading: isEventsLoading, availabilities } = useEventFetching({
    filterType,
    filterIds: allFilterIds,
    staffUserIds,
    refreshEvents
  });
  
  // Combine loading states
  const isLoading = isStaffLoading || isEventsLoading;

  return { events, isLoading, availabilities };
};
