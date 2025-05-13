
import { useState, useEffect } from 'react';
import { CalendarEvent } from '../context/calendarTypes';
import { fetchFilteredEvents } from '../utils/eventProcessing';
import { fetchUserAvailabilityForUsers } from '@/services/availability/availabilityApi';
import { useAvailabilityMapper } from './useAvailabilityMapper';
import { useRoleFilters } from './useRoleFilters';

interface UseEventFetchingProps {
  filterType?: 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | null;
  filterIds: string[];
  staffUserIds: string[];
  refreshEvents: () => Promise<CalendarEvent[] | void>;
}

/**
 * Hook that handles fetching events and availabilities based on provided filters
 */
export const useEventFetching = ({ 
  filterType, 
  filterIds,
  staffUserIds, 
  refreshEvents 
}: UseEventFetchingProps) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [availabilities, setAvailabilities] = useState({});
  
  const { convertAvailabilityMap } = useAvailabilityMapper();
  const { getRoleFilterForType, isStaffFilterType } = useRoleFilters();

  // Effect to filter events or fetch new ones based on filter parameters
  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();
    
    const applyFilters = async () => {
      if (!isMounted) return;
      setIsLoading(true);
      
      try {
        // If no filter type is specified, just refresh all events
        if (!filterType) {
          if (process.env.NODE_ENV === 'development') {
            console.log('No filterType specified, refreshing all events');
          }
          
          // The refreshEvents function could return events or void
          const result = await refreshEvents();
          if (isMounted) {
            // If result is an array of events, use that
            if (Array.isArray(result)) {
              setEvents(result);
            }
          }
          return;
        }

        if (process.env.NODE_ENV === 'development') {
          console.log(`Applying filters: ${filterType}`, {
            filterIds,
            staffUserIds,
            hasStaffForIndirectFilter: ['course', 'skill'].includes(filterType) && staffUserIds.length > 0
          });
        }

        // For specific filter types with IDs
        if (filterIds.length > 0 || filterType) {
          // Determine which IDs to use for filtering
          const userIds = ['teacher', 'student', 'admin', 'staff'].includes(filterType) 
            ? filterIds 
            : undefined;
          
          const courseIds = filterType === 'course' ? filterIds : undefined;
          const skillIds = filterType === 'skill' ? filterIds : undefined;
          
          // Get role filters based on filter type
          const roleFilter = getRoleFilterForType(filterType);
          
          // Fetch filtered events
          await fetchFilteredEvents({ 
            userIds,
            courseIds,
            skillIds,
            roleFilter,
            setEvents: (fetchedEvents) => {
              if (isMounted) {
                setEvents(fetchedEvents);
              }
            }
          });
          
          // Also fetch availabilities for appropriate filter types
          if (isStaffFilterType(filterType)) {
            // For direct staff filters, use selected IDs
            if (filterIds.length > 0) {
              if (process.env.NODE_ENV === 'development') {
                console.log(`Fetching availability for specific staff:`, filterIds);
              }
              
              const serviceAvailabilities = await fetchUserAvailabilityForUsers(filterIds);
              if (isMounted) {
                setAvailabilities(convertAvailabilityMap(serviceAvailabilities));
              }
            } 
            // For unspecified staff filter, get all staff of that type
            else if (filterType) {
              if (process.env.NODE_ENV === 'development') {
                console.log(`Fetching availability for all ${filterType} users`);
              }
              
              const roles = getRoleFilterForType(filterType);
              const serviceAvailabilities = await fetchUserAvailabilityForUsers([], roles);
              if (isMounted) {
                setAvailabilities(convertAvailabilityMap(serviceAvailabilities));
              }
            }
          }
          // For course/skill filters, fetch availabilities of associated staff
          else if ((filterType === 'course' || filterType === 'skill') && staffUserIds.length > 0) {
            if (process.env.NODE_ENV === 'development') {
              console.log(`Fetching availability for ${staffUserIds.length} staff associated with ${filterType}`);
            }
            
            const serviceAvailabilities = await fetchUserAvailabilityForUsers(staffUserIds);
            if (isMounted) {
              setAvailabilities(convertAvailabilityMap(serviceAvailabilities));
            }
          } else {
            // Clear availabilities for non-staff filters
            setAvailabilities({});
          }
        }
      } catch (error) {
        console.error("Error applying filters:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    applyFilters();
    
    // Cleanup function to handle component unmounting
    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [filterType, staffUserIds, JSON.stringify(filterIds), refreshEvents, convertAvailabilityMap, getRoleFilterForType, isStaffFilterType]);

  return { events, isLoading, availabilities };
};
