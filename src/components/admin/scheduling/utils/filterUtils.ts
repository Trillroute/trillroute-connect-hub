
import { CalendarEvent, UserAvailabilityMap } from '../context/calendarTypes';
import { fetchFilteredEvents } from './eventProcessing';
import { fetchUserAvailabilityForUsers } from '@/services/availability/availabilityApi';
import { UserAvailabilityMap as ServiceUserAvailabilityMap } from '@/services/availability/types';

interface ApplyFilterProps {
  filterType: 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff';
  ids: string[];
  staffUserIds: string[];
  convertAvailabilityMap: (serviceMap: ServiceUserAvailabilityMap) => UserAvailabilityMap;
}

interface FilterResult {
  events: CalendarEvent[];
  availabilities: UserAvailabilityMap;
}

/**
 * Apply filters to events and availability data
 */
export const applyFilter = async ({
  filterType,
  ids,
  staffUserIds,
  convertAvailabilityMap
}: ApplyFilterProps): Promise<FilterResult> => {
  let events: CalendarEvent[] = [];
  let availabilities: UserAvailabilityMap = {};
  
  console.log(`Applying filter: ${filterType}`, { ids, staffUserIds });
  
  try {
    // Determine which IDs to use for filtering based on filter type
    const userIds = ['teacher', 'student', 'admin', 'staff'].includes(filterType) 
      ? ids 
      : undefined;
    
    const courseIds = filterType === 'course' ? ids : undefined;
    const skillIds = filterType === 'skill' ? ids : undefined;
    
    // Get role filters based on filter type
    const roleFilter = getRoleFilterForType(filterType);
    
    // Fetch events based on filter criteria
    const filteredEvents = await fetchFilteredEvents({ 
      userIds,
      courseIds,
      skillIds,
      roleFilter
    });
    
    events = filteredEvents || [];
    console.log(`Filtered ${events.length} events for ${filterType}`);
    
    // Fetch availabilities based on filter type
    if (['teacher', 'admin', 'staff'].includes(filterType)) {
      // For direct staff filters, use selected IDs
      if (ids.length > 0) {
        console.log(`Fetching availability for ${ids.length} specific ${filterType}(s)`);
        const serviceAvailabilities = await fetchUserAvailabilityForUsers(ids);
        availabilities = convertAvailabilityMap(serviceAvailabilities);
      } 
      // For unspecified staff filter, get all staff of that type
      else {
        console.log(`Fetching availability for all ${filterType} users`);
        const roles = getRoleFilterForType(filterType);
        const serviceAvailabilities = await fetchUserAvailabilityForUsers([], roles);
        availabilities = convertAvailabilityMap(serviceAvailabilities);
      }
    }
    // For course/skill filters, fetch availabilities of associated staff
    else if ((filterType === 'course' || filterType === 'skill') && staffUserIds.length > 0) {
      console.log(`Fetching availability for ${staffUserIds.length} staff associated with ${filterType}`);
      const serviceAvailabilities = await fetchUserAvailabilityForUsers(staffUserIds);
      availabilities = convertAvailabilityMap(serviceAvailabilities);
    }
    
    console.log(`Filter results:`, {
      eventsCount: events.length,
      availabilitiesCount: Object.keys(availabilities).length
    });
  } catch (error) {
    console.error("Error applying filter:", error);
  }
  
  return { events, availabilities };
};

/**
 * Get role filter values based on filter type
 */
export const getRoleFilterForType = (type: string): string[] => {
  switch (type) {
    case 'teacher': return ['teacher'];
    case 'student': return ['student'];
    case 'admin': return ['admin', 'superadmin'];
    case 'staff': return ['teacher', 'admin', 'superadmin'];
    default: return [];
  }
};

/**
 * Check if filter type is related to staff
 */
export const isStaffFilterType = (type: string): boolean => {
  return ['teacher', 'admin', 'staff'].includes(type);
};
