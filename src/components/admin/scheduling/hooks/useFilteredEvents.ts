
import { useEffect, useState } from 'react';
import { useCalendar } from '../context/CalendarContext';
import { CalendarEvent } from '../context/calendarTypes';

interface UseFilteredEventsProps {
  filterType?: 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | 'role' | null;
  filterId?: string | null;
  filterIds?: string[];
}

export const useFilteredEvents = ({
  filterType,
  filterId,
  filterIds = []
}: UseFilteredEventsProps = {}) => {
  const { setEvents, events, refreshEvents, availabilities } = useCalendar();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Combination of filterId and filterIds
  const allFilterIds = filterId ? [...filterIds, filterId] : filterIds;
  
  // Log the input parameters for debugging
  console.log('useFilteredEvents received:', { filterType, filterId, filterIds, allFilterIds });

  // Effect to filter events or fetch new ones based on filter parameters
  useEffect(() => {
    const applyFilters = async () => {
      setIsLoading(true);
      try {
        // If no filter type is specified, just refresh all events
        if (!filterType) {
          console.log('No filterType specified, refreshing all events');
          await refreshEvents();
          return;
        }

        // If we have filter IDs, filter events by role or fetch filtered events
        if (filterType === 'role') {
          console.log('Filtering events by role:', allFilterIds);
          await refreshEvents();
          // Server-side filtering already applied by fetchEvents based on role
        } else if (filterType && allFilterIds.length > 0) {
          // For other filter types with IDs (course, teacher, etc.)
          console.log(`Filtering events by ${filterType}:`, allFilterIds);
          await refreshEvents();
          
          // Apply client-side filtering after refresh
          if (events.length > 0) {
            const filteredEvents = filterEventsByType(events, filterType, allFilterIds);
            console.log(`Found ${filteredEvents.length} events after filtering by ${filterType}`);
            setEvents(filteredEvents);
          }
        } else {
          // Just refresh without filtering
          console.log('No specific filters applied, refreshing all events');
          await refreshEvents();
        }
      } catch (error) {
        console.error("Error applying filters:", error);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    applyFilters();
  }, [filterType, JSON.stringify(allFilterIds)]);

  // Function to filter events by type and ID
  const filterEventsByType = (
    allEvents: CalendarEvent[],
    type: string,
    ids: string[]
  ): CalendarEvent[] => {
    if (!ids.length) return allEvents;
    
    console.log(`Filtering ${allEvents.length} events by ${type} with IDs:`, ids);
    
    // Implementation will depend on how event metadata is structured
    // For now, we'll check for IDs in the description as a basic implementation
    return allEvents.filter(event => {
      if (!event.description) return false;
      
      // Check if any of the IDs are mentioned in the description
      return ids.some(id => {
        const pattern = new RegExp(`${type}_id:${id}\\b`);
        return pattern.test(event.description);
      });
    });
  };

  return { events, isLoading, isInitialized, availabilities };
};
