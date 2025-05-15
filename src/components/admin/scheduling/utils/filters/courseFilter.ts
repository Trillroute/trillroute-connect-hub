
import { CalendarEvent } from '../../types';
import { UserAvailabilityMap as ContextUserAvailabilityMap } from '../../context/calendarTypes';
import { fetchFilteredEvents } from '../eventProcessing';
import { fetchAvailabilityForUsers } from './availabilityHelper';

type SetEventsFunction = (events: CalendarEvent[]) => void;
type SetAvailabilitiesFunction = (availabilities: ContextUserAvailabilityMap) => void;
type ConvertAvailabilityFunction = (serviceMap: any) => ContextUserAvailabilityMap;

/**
 * Apply course-based filtering
 */
export const applyCourseFilter = async (
  ids: string[],
  staffUserIds: string[],
  setEvents: SetEventsFunction,
  setAvailabilities: SetAvailabilitiesFunction,
  convertAvailabilityMap: ConvertAvailabilityFunction
): Promise<void> => {
  // Fetch events filtered by course IDs
  await fetchFilteredEvents({ courseIds: ids, setEvents });
  
  // Also fetch availabilities for staff teaching these courses
  if (staffUserIds.length > 0) {
    const serviceAvailabilities = await fetchAvailabilityForUsers(staffUserIds);
    setAvailabilities(convertAvailabilityMap(serviceAvailabilities));
  } else {
    // Even with no staff, we should fetch all teacher availabilities for this course
    const serviceAvailabilities = await fetchAvailabilityForUsers([], ['teacher']);
    setAvailabilities(convertAvailabilityMap(serviceAvailabilities));
  }
};
