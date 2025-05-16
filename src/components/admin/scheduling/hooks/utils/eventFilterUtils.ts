
import { CalendarEvent, FilterState } from '../types/filterTypes';

/**
 * Filters calendar events based on provided filter criteria
 */
export function filterEvents(events: CalendarEvent[] = [], filters: FilterState = { users: [], courses: [], skills: [] }) {
  const filteredEvents = events.filter(event => {
    if (!event) return false;
    
    // Filter by users
    if (filters.users && filters.users.length > 0 && event.userId && !filters.users.includes(event.userId)) {
      return false;
    }
    
    // Filter by courses
    if (filters.courses && filters.courses.length > 0 && event.courseId && !filters.courses.includes(event.courseId)) {
      return false;
    }
    
    // Filter by skills
    if (filters.skills && filters.skills.length > 0 && event.skillId && !filters.skills.includes(event.skillId)) {
      return false;
    }
    
    // Filter by date range
    if (filters.startDate && event.start < filters.startDate) {
      return false;
    }
    
    if (filters.endDate && event.end > filters.endDate) {
      return false;
    }
    
    return true;
  });
  
  return { filteredEvents };
}
