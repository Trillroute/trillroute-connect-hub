
import { useState, useCallback } from 'react';
import { CalendarEvent, UserAvailabilityMap } from '../context/calendarTypes';
import { isSameDay } from 'date-fns';

export interface CellInfo {
  id?: string;
  name: string;
  isEvent: boolean;
  category?: string;
  description?: string;
}

export const useCellInfo = (events: CalendarEvent[], availabilities: UserAvailabilityMap) => {
  // Cache cell info to prevent re-generating on each render
  const [cellInfoCache, setCellInfoCache] = useState<Record<string, CellInfo[]>>({});

  const getCellInfo = useCallback((
    day: { name: string; date: Date; dayOfWeek: number },
    timeSlot: string
  ): CellInfo[] => {
    if (!day || !timeSlot) {
      return [];
    }

    // Create a cache key using day and time slot
    const cacheKey = `${day.date.toDateString()}-${timeSlot}`;
    
    // If we have cached data, return it
    if (cellInfoCache[cacheKey]) {
      return cellInfoCache[cacheKey];
    }
    
    const result: CellInfo[] = [];
    
    // Check if there are events at this day and time
    if (events && Array.isArray(events)) {
      const matchingEvents = events.filter(event => {
        if (!event || !event.start) return false;
        
        const eventStart = new Date(event.start);
        const eventHour = eventStart.getHours();
        const eventMinutes = eventStart.getMinutes();
        const [slotHour, slotMinutes] = timeSlot.split(':').map(Number);
        
        return (
          isSameDay(eventStart, day.date) && 
          eventHour === slotHour && 
          eventMinutes === (slotMinutes || 0)
        );
      });
      
      // Add matching events to result
      matchingEvents.forEach(event => {
        result.push({
          id: event.id,
          name: event.title || 'Untitled Event',
          isEvent: true,
          category: event.eventCategory || 'Event',
          description: event.description
        });
      });
    }
    
    // Check for availability slots at this day and time
    if (availabilities && typeof availabilities === 'object') {
      const userIds = Object.keys(availabilities);
      
      for (const userId of userIds) {
        const userData = availabilities[userId];
        
        if (userData && Array.isArray(userData.slots)) {
          // Find slots matching this day and time
          const matchingSlots = userData.slots.filter(slot => {
            if (!slot || typeof slot.dayOfWeek !== 'number' || !slot.startTime) {
              return false;
            }
            
            // Check if the day of week matches
            if (slot.dayOfWeek !== day.dayOfWeek) return false;
            
            // Parse the time slot and slot start time
            const [slotHour, slotMinutes] = timeSlot.split(':').map(Number);
            const [startHour, startMinutes] = slot.startTime.split(':').map(Number);
            
            if (isNaN(slotHour) || isNaN(startHour)) {
              return false;
            }
            
            // Compare times - simple hour:minute comparison
            return startHour === slotHour && startMinutes === (slotMinutes || 0);
          });
          
          // Add matching availability slots to result
          matchingSlots.forEach(slot => {
            result.push({
              id: `${userId}-${slot.dayOfWeek}-${slot.startTime}`,
              name: userData.name || 'Staff Member',
              isEvent: false,
              category: slot.category || 'Available',
              description: `${userData.name || 'Staff member'} is available`
            });
          });
        }
      }
    }
    
    // Cache the result
    setCellInfoCache(prev => ({
      ...prev,
      [cacheKey]: result
    }));
    
    return result;
  }, [events, availabilities, cellInfoCache]);

  return { getCellInfo };
};
