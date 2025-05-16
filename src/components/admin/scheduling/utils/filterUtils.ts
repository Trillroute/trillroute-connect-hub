
import { fetchFilteredEvents } from './eventProcessing';
import { fetchUserAvailabilityForUsers } from '@/services/availability/api';
import { UserAvailabilityMap as ServiceUserAvailabilityMap } from '@/services/availability/types';
import { UserAvailabilityMap as ContextUserAvailabilityMap } from '../context/calendarTypes';
import { CalendarEvent } from '../types';
import { fetchStaffForSkill, getUsersBySkills } from '@/services/skills/skillStaffService';

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
  console.log(`==== APPLYING ${filterType?.toUpperCase() || 'UNKNOWN'} FILTER ====`);
  console.log('Filter IDs:', ids);
  
  try {
    // If no filter type or ids, clear everything
    if (!filterType || !ids || ids.length === 0) {
      console.log('No filter type or IDs, clearing data');
      setEvents([]);
      setAvailabilities({});
      return;
    }
    
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
        console.log('==== SKILL FILTER ====');
        console.log('Processing skill filter for IDs:', ids);
        
        // First, get all users with these skills - with improved error handling
        const usersWithSkills = await getUsersBySkills(ids);
        console.log('Users with selected skills:', usersWithSkills);
        
        if (!usersWithSkills || usersWithSkills.length === 0) {
          console.log('No users found with the selected skills, clearing calendar');
          setEvents([]);
          setAvailabilities({});
          return;
        }
        
        // Get teachers with these skills (for availability)
        const teachersWithSkills = await getUsersBySkills(ids, ['teacher']);
        console.log('Teachers with selected skills:', teachersWithSkills);
        
        // Fetch events for users who have these skills - use both user IDs and skill IDs
        await fetchFilteredEvents({ 
          userIds: usersWithSkills,
          skillIds: ids,
          setEvents 
        });
        
        // Use teachers for availability if found, otherwise use all users with skills
        const userIdsForAvailability = teachersWithSkills.length > 0 ? teachersWithSkills : usersWithSkills;
        
        console.log('Fetching availability for users:', userIdsForAvailability);
        
        // Fetch availabilities for users with these skills
        const serviceAvailabilities = await fetchUserAvailabilityForUsers(userIdsForAvailability);
        
        console.log('Retrieved availability data:', 
          Object.keys(serviceAvailabilities).length, 
          'users with availability'
        );
        
        setAvailabilities(convertAvailabilityMap(serviceAvailabilities));
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
