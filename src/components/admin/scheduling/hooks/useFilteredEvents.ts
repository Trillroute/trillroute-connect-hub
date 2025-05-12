
import { useEffect, useState } from 'react';
import { useCalendar } from '../context/CalendarContext';
import { CalendarEvent } from '../context/calendarTypes';
import { fetchFilteredEvents } from '../utils/eventProcessing';
import { fetchUserAvailabilityForUsers } from '@/services/availability/availabilityApi';
import { UserAvailabilityMap as ServiceUserAvailabilityMap } from '@/services/availability/types';
import { UserAvailabilityMap as ContextUserAvailabilityMap } from '../context/calendarTypes';

interface UseFilteredEventsProps {
  filterType?: 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | null;
  filterId?: string | null;
  filterIds?: string[];
}

export const useFilteredEvents = ({
  filterType,
  filterId,
  filterIds = []
}: UseFilteredEventsProps = {}) => {
  const { events: contextEvents, refreshEvents } = useCalendar();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [availabilities, setAvailabilities] = useState<ContextUserAvailabilityMap>({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Helper function to convert from service availability to context availability
  const convertAvailabilityMap = (serviceMap: ServiceUserAvailabilityMap): ContextUserAvailabilityMap => {
    const contextMap: ContextUserAvailabilityMap = {};
    
    Object.keys(serviceMap).forEach(userId => {
      const userInfo = serviceMap[userId];
      contextMap[userId] = {
        slots: userInfo.slots,
        name: userInfo.name,
        role: userInfo.role || 'teacher'
      };
    });
    
    return contextMap;
  };

  // Combination of filterId and filterIds
  const allFilterIds = filterId ? 
    [...filterIds.filter(id => id !== filterId), filterId] : 
    [...filterIds];
  
  // Log the input parameters for debugging
  useEffect(() => {
    console.log('useFilteredEvents received:', { filterType, filterId, filterIds, allFilterIds });
  }, [filterType, filterId, filterIds, allFilterIds]);

  // Effect to filter events or fetch new ones based on filter parameters
  useEffect(() => {
    const applyFilters = async () => {
      setIsLoading(true);
      try {
        // If no filter type is specified, just refresh all events
        if (!filterType) {
          console.log('No filterType specified, using context events');
          await refreshEvents();
          setEvents(contextEvents);
          return;
        }

        // For specific filter types with IDs
        if (allFilterIds.length > 0) {
          console.log(`Filtering events by ${filterType} with IDs:`, allFilterIds);
          
          // Fetch filtered events
          const result = await fetchFilteredEvents({ 
            userIds: (filterType === 'teacher' || filterType === 'student' || 
                     filterType === 'admin' || filterType === 'staff') ? allFilterIds : undefined,
            courseIds: filterType === 'course' ? allFilterIds : undefined,
            skillIds: filterType === 'skill' ? allFilterIds : undefined,
            roleFilter: getRoleFilterForType(filterType),
            setEvents: (fetchedEvents) => setEvents(fetchedEvents)
          });
          
          // Also fetch availabilities for staff-type filters
          if (isStaffFilterType(filterType) && allFilterIds.length > 0) {
            const serviceAvailabilities = await fetchUserAvailabilityForUsers(allFilterIds);
            setAvailabilities(convertAvailabilityMap(serviceAvailabilities));
          }
        } else if (filterType) {
          // If we have a filter type but no specific IDs, filter by role only
          console.log(`Filtering events by ${filterType} type without specific IDs`);
          
          await fetchFilteredEvents({ 
            roleFilter: getRoleFilterForType(filterType),
            setEvents: (fetchedEvents) => setEvents(fetchedEvents)
          });
          
          // For staff-type filters, fetch all staff availabilities
          if (isStaffFilterType(filterType)) {
            const roles = getRoleFilterForType(filterType);
            const serviceAvailabilities = await fetchUserAvailabilityForUsers([], roles);
            setAvailabilities(convertAvailabilityMap(serviceAvailabilities));
          }
        } else {
          // Fallback to context events if no filters
          setEvents(contextEvents);
        }
      } catch (error) {
        console.error("Error applying filters:", error);
        setEvents(contextEvents); // Fallback to context events on error
      } finally {
        setIsLoading(false);
      }
    };

    applyFilters();
  }, [filterType, JSON.stringify(allFilterIds), contextEvents, refreshEvents]);

  // Helper function to get role filter values based on filter type
  const getRoleFilterForType = (type: string): string[] => {
    switch (type) {
      case 'teacher': return ['teacher'];
      case 'student': return ['student'];
      case 'admin': return ['admin', 'superadmin'];
      case 'staff': return ['teacher', 'admin', 'superadmin'];
      default: return [];
    }
  };
  
  // Helper function to check if filter type is related to staff
  const isStaffFilterType = (type: string): boolean => {
    return ['teacher', 'admin', 'staff'].includes(type);
  };

  return { events, isLoading, availabilities };
};
