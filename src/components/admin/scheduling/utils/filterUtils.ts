
import { fetchFilteredEvents } from './eventProcessing';
import { fetchUserAvailabilityForUsers } from '@/services/availability/availabilityApi';
import { UserAvailabilityMap as ServiceUserAvailabilityMap } from '@/services/availability/types';
import { UserAvailabilityMap as ContextUserAvailabilityMap } from '../context/calendarTypes';
import { CalendarEvent } from '../types';

type SetEventsFunction = (events: CalendarEvent[]) => void;
type SetAvailabilitiesFunction = (availabilities: ContextUserAvailabilityMap) => void;

interface ApplyFilterOptions {
  filterType: string | null;
  ids: string[];
  staffUserIds: string[];
  setEvents: SetEventsFunction;
  setAvailabilities: SetAvailabilitiesFunction;
  convertAvailabilityMap: (serviceMap: ServiceUserAvailabilityMap) => ContextUserAvailabilityMap;
}

// Apply filters based on type and fetch appropriate data
export const applyFilter = async ({
  filterType,
  ids,
  staffUserIds,
  setEvents,
  setAvailabilities,
  convertAvailabilityMap
}: ApplyFilterOptions): Promise<void> => {
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
    }
  } catch (error) {
    console.error("Error applying filter:", error);
  }
};
