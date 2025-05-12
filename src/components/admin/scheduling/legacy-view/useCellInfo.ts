
import { useCallback, useMemo } from 'react';
import { CalendarEvent, UserAvailabilityMap } from '../context/calendarTypes';
import { isValid } from 'date-fns';

interface Day {
  name: string;
  date: Date;
  dayOfWeek: number;
}

export interface CellInfo {
  name: string;
  status: string;
  category?: string;
  description?: string;
  isEvent?: boolean;
  isAvailability?: boolean;
  eventData?: CalendarEvent;
  availabilityData?: any;
}

export const useCellInfo = (events: CalendarEvent[], availabilities: UserAvailabilityMap) => {
  // Memoize availability lookup map for O(1) access by day and time
  const availabilityLookup = useMemo(() => {
    const lookup: Record<number, Record<string, { userData: any, slot: any }>> = {};
    
    // Initialize the data structure for each day of week
    for (let day = 1; day <= 7; day++) {
      lookup[day] = {};
    }

    // Populate the lookup structure
    Object.entries(availabilities).forEach(([userId, userData]) => {
      if (!userData.slots || !Array.isArray(userData.slots)) return;
      
      userData.slots.forEach(slot => {
        if (slot.dayOfWeek === undefined || !slot.startTime) return;
        
        const dayOfWeek = slot.dayOfWeek;
        const startTime = slot.startTime;
        
        if (!lookup[dayOfWeek][startTime]) {
          lookup[dayOfWeek][startTime] = { userData, slot };
        }
      });
    });
    
    return lookup;
  }, [availabilities]);

  // Memoize events by day and time for faster lookups
  const eventsByDayAndTime = useMemo(() => {
    const eventMap: Record<string, CalendarEvent[]> = {};
    
    events.forEach(event => {
      if (!event.start || !event.end) return;
      
      let eventStart: Date;
      
      if (event.start instanceof Date) {
        eventStart = event.start;
      } else {
        try {
          eventStart = new Date(event.start);
          if (!isValid(eventStart)) {
            console.error("Invalid event start date:", event);
            return;
          }
        } catch (error) {
          console.error("Error parsing event date:", error);
          return;
        }
      }
      
      const dateKey = eventStart.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      if (!eventMap[dateKey]) {
        eventMap[dateKey] = [];
      }
      
      eventMap[dateKey].push(event);
    });
    
    return eventMap;
  }, [events]);

  // Updated getCellInfo to return both events and availabilities
  const getCellInfo = useCallback((day: Day, timeSlot: string): CellInfo[] => {
    const results: CellInfo[] = [];
    
    // First check availabilities using our optimized lookup
    if (availabilityLookup[day.dayOfWeek] && availabilityLookup[day.dayOfWeek][timeSlot]) {
      const { userData, slot } = availabilityLookup[day.dayOfWeek][timeSlot];
      results.push({
        name: userData.name || 'Staff',
        status: 'available',
        category: slot.category || 'Regular slot',
        isAvailability: true,
        availabilityData: { userData, slot }
      });
    }
    
    // Check for events
    if (!isValid(day.date)) {
      console.error("Invalid day.date in getCellInfo:", day);
      return results;
    }
    
    const dayDate = new Date(day.date);
    const dateKey = dayDate.toISOString().split('T')[0];
    
    if (eventsByDayAndTime[dateKey]) {
      const [hours, minutes] = timeSlot.split(':').map(Number);
      dayDate.setHours(hours, minutes || 0, 0, 0);
      
      // Create time range for slot
      const slotStart = new Date(dayDate);
      const slotEnd = new Date(slotStart);
      slotEnd.setHours(slotStart.getHours() + 1); // Assuming 1 hour slots
      
      // Find events that overlap with this time slot
      const matchingEvents = eventsByDayAndTime[dateKey].filter(event => {
        const eventStart = event.start instanceof Date ? event.start : new Date(event.start);
        const eventEnd = event.end instanceof Date ? event.end : new Date(event.end);
        
        return (eventStart <= slotEnd && eventEnd >= slotStart);
      });
      
      matchingEvents.forEach(event => {
        results.push({
          name: event.title,
          status: 'booked',
          description: event.description,
          isEvent: true,
          eventData: event
        });
      });
    }
    
    return results;
  }, [availabilityLookup, eventsByDayAndTime]);

  return { getCellInfo };
};

export default useCellInfo;
