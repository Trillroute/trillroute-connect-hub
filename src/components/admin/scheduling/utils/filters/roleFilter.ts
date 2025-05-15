
import { CalendarEvent } from '../../types';
import { UserAvailabilityMap as ContextUserAvailabilityMap } from '../../context/calendarTypes';
import { fetchFilteredEvents } from '../eventProcessing';
import { fetchAvailabilityForUsers } from './availabilityHelper';
import { toast } from '@/components/ui/use-toast';

type SetEventsFunction = (events: CalendarEvent[]) => void;
type SetAvailabilitiesFunction = (availabilities: ContextUserAvailabilityMap) => void;
type ConvertAvailabilityFunction = (serviceMap: any) => ContextUserAvailabilityMap;

interface RoleFilterOptions {
  ids: string[];
  filterType: 'teacher' | 'student' | 'admin' | 'staff' | string;
  setEvents: SetEventsFunction;
  setAvailabilities: SetAvailabilitiesFunction;
  convertAvailabilityMap: ConvertAvailabilityFunction;
}

/**
 * Apply role-based filtering (teacher, student, admin, staff)
 */
export const applyRoleFilter = async ({
  ids,
  filterType,
  setEvents,
  setAvailabilities,
  convertAvailabilityMap
}: RoleFilterOptions): Promise<void> => {
  let roleFilter: string[] = [];
  
  // Determine role filter based on filter type
  switch (filterType) {
    case 'teacher':
      roleFilter = ['teacher'];
      break;
    case 'student':
      roleFilter = ['student'];
      break;
    case 'admin':
      roleFilter = ['admin', 'superadmin'];
      break;
    case 'staff':
      roleFilter = ['teacher', 'admin', 'superadmin'];
      break;
    default:
      roleFilter = [];
  }
  
  // Fetch events with role filter
  await fetchFilteredEvents({ 
    roleFilter,
    userIds: ids.length > 0 ? ids : undefined,
    setEvents 
  });
  
  // For student view, don't fetch availabilities
  if (filterType === 'student') {
    setAvailabilities({});
    return;
  }
  
  // Fetch availabilities for users with specific roles
  let serviceAvailabilities;
  if (ids.length > 0) {
    serviceAvailabilities = await fetchAvailabilityForUsers(ids);
  } else {
    serviceAvailabilities = await fetchAvailabilityForUsers([], roleFilter);
  }
  
  setAvailabilities(convertAvailabilityMap(serviceAvailabilities));
};
