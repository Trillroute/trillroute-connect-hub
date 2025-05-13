
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

// Simple filtering function for events
function filterEvents(events: CalendarEvent[] = [], filters: FilterState = { users: [], courses: [], skills: [] }) {
  const filteredEvents = events.filter(event => {
    // Filter by users
    if (filters.users.length > 0 && event.userId && !filters.users.includes(event.userId)) {
      return false;
    }
    
    // Filter by courses
    if (filters.courses.length > 0 && event.courseId && !filters.courses.includes(event.courseId)) {
      return false;
    }
    
    // Filter by skills
    if (filters.skills.length > 0 && event.skillId && !filters.skills.includes(event.skillId)) {
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
      const userName = userData.name;
      
      userData.slots.forEach((slot: UserAvailability) => {
        result.push({
          id: slot.id,
          userId: slot.user_id,
          userName, // Now property exists in the interface
          dayOfWeek: slot.dayOfWeek,
          startHour: parseInt(slot.startTime.split(':')[0]),
          startMinute: parseInt(slot.startTime.split(':')[1]),
          endHour: parseInt(slot.endTime.split(':')[0]),
          endMinute: parseInt(slot.endTime.split(':')[1]),
          category: slot.category
        });
      });
    });
    
    return result;
  }, [availabilities]);

  // Filter events whenever filters or events change
  useEffect(() => {
    const { filteredEvents: newFilteredEvents } = filterEvents(events, filters);
    setFilteredEvents(newFilteredEvents);
  }, [events, filters]);

  // Filter availabilities whenever filters or availabilities change
  useEffect(() => {
    if (!availabilityArray.length) {
      setFilteredAvailability([]);
      return;
    }

    // Filter availabilities based on user filters
    const filtered = availabilityArray.filter(avail => {
      // If specific users are selected, check if this availability belongs to one of them
      if (filters.users.length > 0 && !filters.users.includes(avail.userId)) {
        return false;
      }
      
      return true;
    });

    setFilteredAvailability(filtered);
  }, [availabilityArray, filters]);

  return {
    filteredEvents,
    filteredAvailability
  };
}
