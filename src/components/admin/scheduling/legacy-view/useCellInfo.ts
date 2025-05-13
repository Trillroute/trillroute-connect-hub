
import { useMemo } from 'react';
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
  // Cache cell info to prevent re-generating on each render using useMemo instead of useState
  const cellInfoCache = useMemo(() => {
    const cache: Record<string, CellInfo[]> = {};
    
    // Pre-compute cell info for all events and availabilities
    if (events && events.length > 0) {
      events.forEach(event => {
        if (event && event.start) {
          const eventStart = new Date(event.start);
          const eventDate = eventStart.toDateString();
          const eventHour = eventStart.getHours();
          const eventMinutes = eventStart.getMinutes();
          const timeSlot = `${eventHour.toString().padStart(2, '0')}:${eventMinutes.toString().padStart(2, '0')}`;
          const cacheKey = `${eventDate}-${timeSlot}`;
          
          if (!cache[cacheKey]) {
            cache[cacheKey] = [];
          }
          
          cache[cacheKey].push({
            id: event.id,
            name: event.title || 'Untitled Event',
            isEvent: true,
            category: event.eventCategory || 'Event',
            description: event.description
          });
        }
      });
    }
    
    // Add availability data to cache
    if (availabilities && typeof availabilities === 'object') {
      const userIds = Object.keys(availabilities);
      
      for (const userId of userIds) {
        const userData = availabilities[userId];
        
        if (userData && Array.isArray(userData.slots)) {
          userData.slots.forEach(slot => {
            if (!slot || typeof slot.dayOfWeek !== 'number' || !slot.startTime) {
              return;
            }
            
            // For each day of the week in the next 7 days
            for (let i = 0; i < 7; i++) {
              const currentDate = new Date();
              currentDate.setDate(currentDate.getDate() + i);
              
              // Only include if day of week matches
              if (currentDate.getDay() === slot.dayOfWeek) {
                const timeSlot = slot.startTime;
                const cacheKey = `${currentDate.toDateString()}-${timeSlot}`;
                
                if (!cache[cacheKey]) {
                  cache[cacheKey] = [];
                }
                
                cache[cacheKey].push({
                  id: `${userId}-${slot.dayOfWeek}-${slot.startTime}`,
                  name: userData.name || 'Staff Member',
                  isEvent: false,
                  category: slot.category || 'Available',
                  description: `${userData.name || 'Staff member'} is available`
                });
              }
            }
          });
        }
      }
    }
    
    return cache;
  }, [events, availabilities]);
  
  // Return function to get cell info from cache
  const getCellInfo = (day: Date, timeSlot: string): CellInfo[] => {
    if (!day || !timeSlot) {
      return [];
    }
    
    // Create a cache key using day and time slot
    const cacheKey = `${day.toDateString()}-${timeSlot}`;
    
    // Return cached data or empty array
    return cellInfoCache[cacheKey] || [];
  };

  return { getCellInfo };
};
