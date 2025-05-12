
import { useCallback } from 'react';
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
  const getCellInfo = useCallback((day: Day, timeSlot: string): CellInfo | null => {
    // Check availabilities first
    const availabilityEntries = Object.entries(availabilities);
    for (const [userId, userData] of availabilityEntries) {
      const slot = userData.slots.find(s => 
        s.dayOfWeek === day.dayOfWeek && 
        s.startTime.startsWith(timeSlot)
      );
      
      if (slot) {
        return {
          name: userData.name,
          status: 'available',
          category: slot.category || 'Regular slot'
        };
      }
    }
    
    // Then check events
    const dayDate = new Date(day.date);
    const [hours, minutes] = timeSlot.split(':').map(Number);
    dayDate.setHours(hours, minutes, 0, 0);
    
    // Find events that overlap with this time slot
    const matchingEvents = events.filter(event => {
      const eventStartDate = new Date(event.start);
      const eventEndDate = new Date(event.end);
      
      // Check if day is the same
      const isSameDay = 
        eventStartDate.getDate() === dayDate.getDate() &&
        eventStartDate.getMonth() === dayDate.getMonth() &&
        eventStartDate.getFullYear() === dayDate.getFullYear();
        
      if (!isSameDay) return false;
      
      // Check if time overlaps
      const slotStart = new Date(dayDate);
      const slotEnd = new Date(slotStart);
      slotEnd.setHours(slotStart.getHours() + 1); // Assuming 1 hour slots
      
      return (
        (eventStartDate <= slotEnd && eventEndDate >= slotStart)
      );
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
  }, [events, availabilities]);

  return { getCellInfo };
};

export default useCellInfo;
