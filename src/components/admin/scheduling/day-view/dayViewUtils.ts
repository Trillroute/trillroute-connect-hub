
import { isSameDay } from 'date-fns';
import { CalendarEvent } from '../context/calendarTypes';

// Process availability data for the current day
export const processAvailabilities = (currentDate: Date, availabilities: any) => {
  // Get day of week (0 = Sunday, 1 = Monday, etc.)
  const dayOfWeek = currentDate.getDay();
  const processedSlots: any[] = [];
  
  // Process all user availabilities
  Object.entries(availabilities).forEach(([userId, userData]: [string, any]) => {
    // Filter slots for current day of week
    const userSlots = userData.slots.filter((slot: any) => slot.dayOfWeek === dayOfWeek);
    
    userSlots.forEach((slot: any) => {
      const [startHour, startMinute] = slot.startTime.split(':').map(Number);
      const [endHour, endMinute] = slot.endTime.split(':').map(Number);
      
      processedSlots.push({
        startHour,
        startMinute,
        endHour,
        endMinute,
        userId: slot.userId,
        userName: userData.name,
        category: slot.category
      });
    });
  });
  
  return processedSlots;
};

// Filter events for the current day
export const filterTodayEvents = (events: CalendarEvent[], currentDate: Date) => {
  return events.filter(event => 
    isSameDay(event.start, currentDate)
  );
};

// Check if a time slot has availability
export const isTimeAvailable = (availabilitySlots: any[], hour: number) => {
  return availabilitySlots.some(slot => 
    (slot.startHour <= hour && slot.endHour > hour)
  );
};
