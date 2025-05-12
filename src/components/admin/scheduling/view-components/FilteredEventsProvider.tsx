
import React, { useEffect } from 'react';
import { useFilteredEvents } from '../hooks/useFilteredEvents';
import { useCalendar } from '../context/CalendarContext';

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
  // Get events from the FilteredEvents hook with improved debugging
  const { events: filteredEvents, isLoading, availabilities } = useFilteredEvents({
    filterType,
    filterId,
    filterIds
  });
  
  // Access the calendar context to update events
  const { setEvents, setAvailabilities } = useCalendar();
  
  // Effect to update the events in the calendar context when they change
  useEffect(() => {
    if (!isLoading && filteredEvents) {
      console.log(`FilteredEventsProvider: Setting ${filteredEvents.length} events for ${filterType || 'all'} filter`);
      setEvents(filteredEvents);
    }
  }, [filteredEvents, isLoading, setEvents, filterType]);
  
  // Effect to update the availabilities in the calendar context
  useEffect(() => {
    if (availabilities) {
      console.log(`FilteredEventsProvider: Setting availabilities for ${filterType || 'all'} filter`, 
        { availabilityCount: Object.keys(availabilities).length });
      setAvailabilities(availabilities);
    }
  }, [availabilities, setAvailabilities, filterType]);
  
  return <>{children}</>;
};
