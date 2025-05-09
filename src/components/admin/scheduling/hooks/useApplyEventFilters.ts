
import { useEffect } from 'react';
import { fetchFilteredEvents } from '../utils/eventProcessing';
import { fetchUserAvailabilityForUsers } from '@/services/availability/availabilityApi';
import { convertAvailabilityMap } from '../utils/availabilityUtils';

/**
 * Hook to apply event filters and fetch corresponding data
 */
export const useApplyEventFilters = (
  filterType: 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | null | undefined,
  filterId: string | null | undefined,
  filterIds: string[],
  staffUserIds: string[],
  refreshEvents: () => void,
  setEvents: (events: any[]) => void,
  setAvailabilities: (availabilities: any) => void
) => {
  // Apply filters when filter type or IDs change
  useEffect(() => {
    console.log("FilteredEventsProvider received:", { filterType, filterId, filterIds });
    
    if (!filterType) {
      console.log("No filterType specified, refreshing all events");
      refreshEvents();
      return;
    }

    // Apply the appropriate filter
    const applyFilter = async () => {
      // Make sure filterIds is an array
      const safeFilterIds = Array.isArray(filterIds) ? [...filterIds] : [];
      
      // If we have both filterIds array and a single filterId, combine them
      const ids = filterId 
        ? [...safeFilterIds, filterId].filter(Boolean) 
        : safeFilterIds.filter(Boolean);
      
      console.log(`Applying ${filterType} filter with IDs:`, ids);
      
      try {
        // Fetch events based on filter type
        switch (filterType) {
          case 'course':
            await fetchFilteredEvents({ courseIds: ids, setEvents });
            
            // Also fetch availabilities for staff teaching these courses
            if (staffUserIds.length > 0) {
              const serviceAvailabilities = await fetchUserAvailabilityForUsers(staffUserIds);
              setAvailabilities(convertAvailabilityMap(serviceAvailabilities));
            } else {
              setAvailabilities({}); // Clear availabilities if no staff
            }
            break;
            
          case 'skill':
            await fetchFilteredEvents({ skillIds: ids, setEvents });
            
            // Also fetch availabilities for staff teaching these skills
            if (staffUserIds.length > 0) {
              const serviceAvailabilities = await fetchUserAvailabilityForUsers(staffUserIds);
              setAvailabilities(convertAvailabilityMap(serviceAvailabilities));
            } else {
              setAvailabilities({}); // Clear availabilities if no staff
            }
            break;
            
          case 'teacher':
            await fetchFilteredEvents({ 
              roleFilter: ['teacher'],
              userIds: ids.length > 0 ? ids : undefined,
              setEvents 
            });
            
            // Fetch availabilities for these specific teachers
            if (ids.length > 0) {
              const serviceAvailabilities = await fetchUserAvailabilityForUsers(ids);
              setAvailabilities(convertAvailabilityMap(serviceAvailabilities));
            } else {
              // If no specific teachers, fetch all teacher availabilities
              const serviceAvailabilities = await fetchUserAvailabilityForUsers([], ['teacher']);
              setAvailabilities(convertAvailabilityMap(serviceAvailabilities));
            }
            break;
            
          case 'student':
            await fetchFilteredEvents({ 
              roleFilter: ['student'],
              userIds: ids.length > 0 ? ids : undefined,
              setEvents 
            });
            // Students don't have availabilities, so clear them
            setAvailabilities({});
            break;
            
          case 'admin':
            await fetchFilteredEvents({ 
              roleFilter: ['admin', 'superadmin'], 
              userIds: ids.length > 0 ? ids : undefined,
              setEvents 
            });
            
            // Fetch availabilities for these specific admins
            if (ids.length > 0) {
              const serviceAvailabilities = await fetchUserAvailabilityForUsers(ids);
              setAvailabilities(convertAvailabilityMap(serviceAvailabilities));
            } else {
              // If no specific admins, fetch all admin availabilities
              const serviceAvailabilities = await fetchUserAvailabilityForUsers([], ['admin', 'superadmin']);
              setAvailabilities(convertAvailabilityMap(serviceAvailabilities));
            }
            break;
            
          case 'staff':
            await fetchFilteredEvents({ 
              roleFilter: ['teacher', 'admin', 'superadmin'], 
              userIds: ids.length > 0 ? ids : undefined,
              setEvents 
            });
            
            // Fetch availabilities for these specific staff members
            if (ids.length > 0) {
              const serviceAvailabilities = await fetchUserAvailabilityForUsers(ids);
              setAvailabilities(convertAvailabilityMap(serviceAvailabilities));
            } else {
              // If no specific staff, fetch all staff availabilities
              const serviceAvailabilities = await fetchUserAvailabilityForUsers([], ['teacher', 'admin', 'superadmin']);
              setAvailabilities(convertAvailabilityMap(serviceAvailabilities));
            }
            break;
            
          default:
            console.log("Unknown filterType, refreshing all events");
            refreshEvents();
            setAvailabilities({});
        }
      } catch (error) {
        console.error("Error applying filter:", error);
        // Fallback to showing all events
        refreshEvents();
        setAvailabilities({});
      }
    };

    applyFilter();
  }, [filterType, filterId, filterIds, staffUserIds, refreshEvents, setEvents, setAvailabilities]);
};
