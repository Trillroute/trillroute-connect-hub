
import { isSameDay } from 'date-fns';
import { CalendarEvent } from '../context/calendarTypes';

// Process availability data for the current day
export const processAvailabilities = (currentDate: Date, availabilities: any) => {
  // Get day of week (0 = Sunday, 1 = Monday, etc.)
  const dayOfWeek = currentDate.getDay();
  const processedSlots: any[] = [];
  
  if (!availabilities) return processedSlots;
  
  // Process all user availabilities
  Object.entries(availabilities).forEach(([userId, userData]: [string, any]) => {
    if (!userData || !userData.slots || !Array.isArray(userData.slots)) return;
    
    // Filter slots for current day of week
    const userSlots = userData.slots.filter((slot: any) => slot.dayOfWeek === dayOfWeek);
    
    userSlots.forEach((slot: any) => {
      if (!slot || !slot.startTime || !slot.endTime) return;
      
      const [startHour, startMinute] = slot.startTime.split(':').map(Number);
      const [endHour, endMinute] = slot.endTime.split(':').map(Number);
      
      processedSlots.push({
        startHour,
        startMinute,
        endHour,
        endMinute,
        userId: slot.userId || slot.user_id || userId,
        userName: userData.name || 'Unknown',
        category: slot.category || 'Default'
      });
    });
  });
  
  return processedSlots;
};

// Filter events for the current day
export const filterTodayEvents = (events: CalendarEvent[] = [], currentDate: Date) => {
  if (!events || !currentDate) return [];
  
  return events.filter(event => 
    event && event.start && isSameDay(event.start, currentDate)
  );
};

// Check if a time slot has availability
export const isTimeAvailable = (availabilitySlots: any[] = [], hour: number) => {
  if (!availabilitySlots || availabilitySlots.length === 0) return false;
  
  return availabilitySlots.some(slot => 
    slot && typeof slot.startHour === 'number' && 
    typeof slot.endHour === 'number' &&
    (slot.startHour <= hour && slot.endHour > hour)
  );
};
