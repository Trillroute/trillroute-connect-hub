
import { useCallback, useMemo } from 'react';
import { CalendarEvent, UserAvailabilityMap } from '../context/calendarTypes';

interface Day {
  name: string;
  date: Date;
  dayOfWeek: number;
}

interface CellInfo {
  name: string;
  status: string;
  category?: string;
  description?: string;
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
        if (!slot.dayOfWeek || !slot.startTime) return;
        
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
      
      const eventStart = new Date(event.start);
      const dateKey = eventStart.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      if (!eventMap[dateKey]) {
        eventMap[dateKey] = [];
      }
      
      eventMap[dateKey].push(event);
    });
    
    return eventMap;
  }, [events]);

  // Improved getCellInfo with stable reference and optimized lookups
  const getCellInfo = useCallback((day: Day, timeSlot: string): CellInfo | null => {
    // First check availabilities using our optimized lookup
    if (availabilityLookup[day.dayOfWeek] && availabilityLookup[day.dayOfWeek][timeSlot]) {
      const { userData, slot } = availabilityLookup[day.dayOfWeek][timeSlot];
      return {
        name: userData.name || 'Staff',
        status: 'available',
        category: slot.category || 'Regular slot'
      };
    }
    
    // Check for events
    const dayDate = new Date(day.date);
    const dateKey = dayDate.toISOString().split('T')[0];
    
    // If no events for this day, return early
    if (!eventsByDayAndTime[dateKey]) return null;
    
    const [hours, minutes] = timeSlot.split(':').map(Number);
    dayDate.setHours(hours, minutes || 0, 0, 0);
    
    // Create time range for slot
    const slotStart = new Date(dayDate);
    const slotEnd = new Date(slotStart);
    slotEnd.setHours(slotStart.getHours() + 1); // Assuming 1 hour slots
    
    // Find events that overlap with this time slot
    const matchingEvents = eventsByDayAndTime[dateKey].filter(event => {
      const eventStartDate = new Date(event.start);
      const eventEndDate = new Date(event.end);
      
      return (eventStartDate <= slotEnd && eventEndDate >= slotStart);
    });
    
    if (matchingEvents.length > 0) {
      const event = matchingEvents[0]; // Take first matching event if multiple
      return {
        name: event.title,
        status: 'booked',
        description: event.description
      };
    }
    
    return null;
  }, [availabilityLookup, eventsByDayAndTime]);

  return { getCellInfo };
};

export default useCellInfo;
