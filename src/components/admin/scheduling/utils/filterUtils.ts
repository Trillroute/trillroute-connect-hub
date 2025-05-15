
import { fetchFilteredEvents } from './eventProcessing';
import { fetchUserAvailabilityForUsers } from '@/services/availability/availabilityApi';
import { UserAvailabilityMap as ServiceUserAvailabilityMap } from '@/services/availability/types';
import { UserAvailabilityMap as ContextUserAvailabilityMap } from '../context/calendarTypes';
import { CalendarEvent } from '../types';
import { fetchStaffForSkill } from '@/services/skills/skillStaffService';

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
          // Even with no staff, we should fetch all teacher availabilities for this course
          const serviceAvailabilities = await fetchUserAvailabilityForUsers([], ['teacher']);
          setAvailabilities(convertAvailabilityMap(serviceAvailabilities));
        }
        break;
        
      case 'skill':
        await fetchFilteredEvents({ skillIds: ids, setEvents });
        
        // Get teachers who have these skills
        const teacherIds = await fetchStaffForSkill(ids);
        
        // Also fetch availabilities for staff teaching these skills
        if (teacherIds.length > 0) {
          const serviceAvailabilities = await fetchUserAvailabilityForUsers(teacherIds);
          setAvailabilities(convertAvailabilityMap(serviceAvailabilities));
        } else {
          // Even with no staff, we should fetch all teacher availabilities for this skill
          const serviceAvailabilities = await fetchUserAvailabilityForUsers([], ['teacher']);
          setAvailabilities(convertAvailabilityMap(serviceAvailabilities));
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
        // For students view, don't fetch teacher availabilities - set an empty object
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
        // Default case - fetch all events and all staff availabilities
        await fetchFilteredEvents({ setEvents });
        const allAvailabilities = await fetchUserAvailabilityForUsers([], ['teacher', 'admin', 'superadmin']);
        setAvailabilities(convertAvailabilityMap(allAvailabilities));
        break;
    }
  } catch (error) {
    console.error("Error applying filter:", error);
    // Set empty data in case of error to prevent UI from breaking
    setEvents([]);
    setAvailabilities({});
  }
};
