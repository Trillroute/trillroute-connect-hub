
import { useMemo, useEffect, useState } from 'react';
import { UserAvailabilityMap, UserAvailability } from '@/services/availability/types';

interface FilterState {
  users: string[];
  startDate?: Date;
  endDate?: Date;
  courses: string[];
  skills: string[];
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  userId?: string;
  courseId?: string;
  skillId?: string;
  color?: string;
}

interface CalendarUserAvailability {
  id: string;
  userId: string;
  userName?: string;
  dayOfWeek: number;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  category?: string;
}

interface UseFilteredEventsProps {
  events?: CalendarEvent[];
  filters?: FilterState;
  availabilities?: UserAvailabilityMap | null;
  filterType?: 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | null;
  filterId?: string | null;
  filterIds?: string[];
}

// Improved filtering function for events
function filterEvents(events: CalendarEvent[] = [], filters: FilterState = { users: [], courses: [], skills: [] }) {
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

/**
 * Custom hook to filter calendar events and availabilities based on filter criteria
 */
export function useFilteredEvents({ 
  events = [], 
  filters = { users: [], courses: [], skills: [] }, 
  availabilities,
  filterType,
  filterId,
  filterIds = []
}: UseFilteredEventsProps) {
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);
  const [filteredAvailability, setFilteredAvailability] = useState<CalendarUserAvailability[]>([]);

  // Convert availability map to array for filtering and compatibility with calendar
  const availabilityArray = useMemo(() => {
    if (!availabilities) return [];

    const result: CalendarUserAvailability[] = [];
    
    Object.entries(availabilities).forEach(([userId, userData]) => {
      const userName = userData?.name;
      
      if (!userData.slots || !Array.isArray(userData.slots)) return;
      
      userData.slots.forEach((slot: UserAvailability) => {
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
  }, [availabilities]);

  // Filter events whenever filters or events change
  useEffect(() => {
    // Create a combined filter from both the filters prop and the filterType/filterId props
    const combinedFilter = { ...filters };
    
    // Add filterIds to the appropriate filter category
    if (filterType === 'teacher' || filterType === 'student' || filterType === 'admin' || filterType === 'staff') {
      combinedFilter.users = [...(combinedFilter.users || [])];
      if (filterId) combinedFilter.users.push(filterId);
      if (filterIds && filterIds.length > 0) combinedFilter.users.push(...filterIds);
    } else if (filterType === 'course') {
      combinedFilter.courses = [...(combinedFilter.courses || [])];
      if (filterId) combinedFilter.courses.push(filterId);
      if (filterIds && filterIds.length > 0) combinedFilter.courses.push(...filterIds);
    } else if (filterType === 'skill') {
      combinedFilter.skills = [...(combinedFilter.skills || [])];
      if (filterId) combinedFilter.skills.push(filterId);
      if (filterIds && filterIds.length > 0) combinedFilter.skills.push(...filterIds);
      console.log('Added skill filters:', combinedFilter.skills);
    }
    
    const { filteredEvents: newFilteredEvents } = filterEvents(events, combinedFilter);
    setFilteredEvents(newFilteredEvents);
  }, [events, filters, filterType, filterId, filterIds]);

  // Filter availabilities whenever filters or availabilities change
  useEffect(() => {
    if (!availabilityArray.length) {
      setFilteredAvailability([]);
      return;
    }

    // Filter availabilities based on user filters
    const filtered = availabilityArray.filter(avail => {
      // If specific users are selected, check if this availability belongs to one of them
      if (filters.users && filters.users.length > 0 && avail.userId && !filters.users.includes(avail.userId)) {
        return false;
      }
      
      // Also filter by filterIds if filterType is 'teacher', 'student', 'admin', or 'staff'
      if ((filterType === 'teacher' || filterType === 'student' || filterType === 'admin' || filterType === 'staff') && 
          filterIds && filterIds.length > 0 && 
          avail.userId && !filterIds.includes(avail.userId)) {
        return false;
      }
      
      return true;
    });

    setFilteredAvailability(filtered);
  }, [availabilityArray, filters, filterType, filterIds]);

  return {
    filteredEvents,
    filteredAvailability
  };
}
