
import { fetchEventsByFilter } from '@/services/events/api/eventFilters';
import { fetchUserAvailabilityForUsers } from '@/services/availability/api/staffAvailability';

interface ApplyFilterProps {
  filterType?: 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | null;
  ids?: string[];
  defaultRoles?: string[];
  setEvents: (events: any[]) => void;
  setAvailabilities: (availabilities: any) => void;
  convertAvailabilityMap: (map: any) => any;
}

/**
 * Apply event and availability filters based on provided filter parameters
 */
export const applyFilter = async ({
  filterType,
  ids = [],
  defaultRoles = [],
  setEvents,
  setAvailabilities,
  convertAvailabilityMap
}: ApplyFilterProps) => {
  try {
    console.log(`Applying ${filterType || 'null'} filter with ${ids.length} IDs and ${defaultRoles.length} default roles`);
    
    // Fetch events based on filter type and IDs
    const events = await fetchEventsByFilter({ filterType, filterIds: ids });
    console.log(`Fetched ${events.length} events after applying filter`);
    setEvents(events);
    
    // Fetch user availability based on filter type
    if (filterType === 'teacher' || filterType === 'admin' || filterType === 'staff' || filterType === 'student') {
      // If specific IDs are provided, fetch for those users
      if (ids && ids.length > 0) {
        const userAvailability = await fetchUserAvailabilityForUsers(ids);
        console.log(`Fetched availability for ${Object.keys(userAvailability).length} users by ID`);
        setAvailabilities(convertAvailabilityMap(userAvailability));
      }
      // If no IDs are specified but we have default roles, fetch for those roles
      else if (defaultRoles && defaultRoles.length > 0) {
        const userAvailability = await fetchUserAvailabilityForUsers([], defaultRoles);
        console.log(`Fetched availability for ${Object.keys(userAvailability).length} users by roles: ${defaultRoles.join(', ')}`);
        setAvailabilities(convertAvailabilityMap(userAvailability));
      }
      // If neither IDs nor defaultRoles are specified, clear availabilities
      else {
        console.log('No IDs or default roles specified, clearing availabilities');
        setAvailabilities({});
      }
    } else {
      // For non-user filter types (like courses, skills), clear availabilities
      setAvailabilities({});
    }
  } catch (error) {
    console.error('Error applying filter:', error);
    // Set empty arrays/objects on error
    setEvents([]);
    setAvailabilities({});
  }
};
