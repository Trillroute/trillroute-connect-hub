
import { UserAvailabilityMap } from '@/services/availability/types';
import { CalendarUserAvailability } from '../types/filterTypes';

/**
 * Converts availability map to array format for filtering and compatibility with calendar
 */
export function convertAvailabilityMapToArray(availabilities?: UserAvailabilityMap | null): CalendarUserAvailability[] {
  if (!availabilities) return [];

  const result: CalendarUserAvailability[] = [];
  
  Object.entries(availabilities).forEach(([userId, userData]) => {
    const userName = userData?.name;
    
    if (!userData.slots || !Array.isArray(userData.slots)) return;
    
    userData.slots.forEach((slot) => {
      if (!slot.startTime || !slot.endTime) return;
      
      try {
        const startParts = slot.startTime.split(':');
        const endParts = slot.endTime.split(':');
        
        if (startParts.length !== 2 || endParts.length !== 2) return;
        
        result.push({
          id: slot.id,
          userId: slot.user_id || userId,
          userName,
          dayOfWeek: slot.dayOfWeek,
          startHour: parseInt(startParts[0], 10),
          startMinute: parseInt(startParts[1], 10),
          endHour: parseInt(endParts[0], 10),
          endMinute: parseInt(endParts[1], 10),
          category: slot.category
        });
      } catch (error) {
        console.error('Error parsing availability time slot:', error);
      }
    });
  });
  
  return result;
}

/**
 * Filters availability slots based on user filters
 */
export function filterAvailability(
  availabilityArray: CalendarUserAvailability[],
  filters: { users: string[] },
  filterType?: string | null,
  filterIds?: string[]
): CalendarUserAvailability[] {
  if (!availabilityArray.length) {
    return [];
  }
  
  console.log(`Filtering ${availabilityArray.length} availability slots with filterType: ${filterType}`);

  // Special case: if no filterIds are provided but filterType is set, 
  // show all availabilities for that role (don't filter them)
  const shouldShowAllForType = filterIds && filterIds.length === 0 && filterType && 
    (filterType === 'teacher' || filterType === 'admin' || filterType === 'staff');
    
  // Filter availabilities based on user filters
  const filtered = availabilityArray.filter(avail => {
    // If we should show all for the selected filter type, don't filter by user IDs
    if (shouldShowAllForType) {
      return true;
    }
    
    // If specific users are selected, check if this availability belongs to one of them
    if (filters.users && filters.users.length > 0 && avail.userId && !filters.users.includes(avail.userId)) {
      return false;
    }
    
    // Also filter by filterIds if filterType is user-related and filterIds is not empty
    if ((filterType === 'teacher' || filterType === 'student' || filterType === 'admin' || filterType === 'staff') && 
        filterIds && filterIds.length > 0 && 
        avail.userId && !filterIds.includes(avail.userId)) {
      return false;
    }
    
    return true;
  });

  console.log(`After filtering: ${filtered.length} availability slots remain`);
  return filtered;
}
