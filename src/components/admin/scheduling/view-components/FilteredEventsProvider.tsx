import React, { useEffect } from 'react';
import { useFilteredEvents } from '../hooks/useFilteredEvents';
import { useCalendar } from '../context/CalendarContext';
import { useStaffAvailability } from '@/hooks/useStaffAvailability';

interface FilteredEventsProviderProps {
  children: React.ReactNode;
  filterType: 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | null;
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
  // Get events from the FilteredEvents hook
  const { events: filteredEvents, isLoading } = useFilteredEvents({
    filterType,
    filterId,
    filterIds
  });
  
  // Access the calendar context to update events
  const { setEvents, setAvailabilities } = useCalendar();
  
  // Fetch staff availability
  const { availabilityByUser, loading: availabilityLoading, refetch } = useStaffAvailability();
  
  // Effect to update the events in the calendar context when they change
  useEffect(() => {
    if (!isLoading) {
      setEvents(filteredEvents);
    }
  }, [filteredEvents, isLoading, setEvents]);
  
  // Effect to update the availabilities in the calendar context
  useEffect(() => {
    if (!availabilityLoading) {
      // If we have a specific filterType and filterIds for users, we can filter the availabilities
      if ((filterType === 'teacher' || filterType === 'staff' || filterType === 'admin') && filterIds.length > 0) {
        const filteredAvailabilities = Object.fromEntries(
          Object.entries(availabilityByUser).filter(([userId]) => filterIds.includes(userId))
        );
        setAvailabilities(filteredAvailabilities);
      } else {
        // Otherwise just set all availabilities
        setAvailabilities(availabilityByUser);
      }
    }
  }, [availabilityByUser, availabilityLoading, filterType, filterIds, setAvailabilities]);
  
  // Force reload data when filter changes
  useEffect(() => {
    refetch();
  }, [filterType, filterIds, refetch]);
  
  return <>{children}</>;
};
