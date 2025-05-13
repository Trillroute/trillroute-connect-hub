
import { useMemo, useEffect, useState } from 'react';
import { CalendarEvent, FilterState, UserAvailability as CalendarUserAvailability } from '../context/calendarTypes';
import { UserAvailabilityMap, UserAvailability } from '@/services/availability/types';
import { filterEvents } from '../utils/filterUtils';

interface UseFilteredEventsProps {
  events: CalendarEvent[];
  filters: FilterState;
  availabilities?: UserAvailabilityMap | null;
}

/**
 * Custom hook to filter calendar events and availabilities based on filter criteria
 */
export function useFilteredEvents({ events, filters, availabilities }: UseFilteredEventsProps) {
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
          userName: userName,
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
