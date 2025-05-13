
import { CalendarEvent, UserAvailabilityMap } from '../context/calendarTypes';
import { format, addDays, startOfDay } from 'date-fns';

/**
 * Extracts unique time slots from both events and availability data
 */
export function getTimeSlots(events: CalendarEvent[], availabilities: UserAvailabilityMap): string[] {
  const timeSlotSet = new Set<string>();
  
  // Get time slots from events
  if (events && Array.isArray(events)) {
    events.forEach(event => {
      const startDate = new Date(event.start);
      const hour = startDate.getHours();
      const minutes = startDate.getMinutes();
      const timeString = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      timeSlotSet.add(timeString);
    });
  }
  
  // Get time slots from availability data
  if (availabilities && typeof availabilities === 'object') {
    Object.values(availabilities).forEach(userData => {
      if (userData && Array.isArray(userData.slots)) {
        userData.slots.forEach(slot => {
          if (slot.startTime) {
            timeSlotSet.add(slot.startTime);
          }
        });
      }
    });
  }
  
  // If no time slots found, add default business hours (9 AM to 5 PM)
  if (timeSlotSet.size === 0) {
    for (let hour = 9; hour <= 17; hour++) {
      timeSlotSet.add(`${hour.toString().padStart(2, '0')}:00`);
    }
  }
  
  // Sort time slots chronologically
  const sortedTimeSlots = Array.from(timeSlotSet).sort((a, b) => {
    const [aHour, aMinutes] = a.split(':').map(Number);
    const [bHour, bMinutes] = b.split(':').map(Number);
    
    if (aHour === bHour) {
      return aMinutes - bMinutes;
    }
    return aHour - bHour;
  });
  
  return sortedTimeSlots;
}

/**
 * Gets the day names and dates for a week starting from the given date
 */
export function getDaysOfWeek(currentDate: Date): { name: string; date: Date; dayOfWeek: number }[] {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const result = [];
  
  // Ensure we have a valid date
  const baseDate = currentDate && currentDate instanceof Date ? currentDate : new Date();
  const startDay = startOfDay(baseDate);
  
  // Create 7 days starting from the current date
  for (let i = 0; i < 7; i++) {
    const date = addDays(startDay, i);
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    result.push({
      name: dayNames[dayOfWeek],
      date: date,
      dayOfWeek: dayOfWeek
    });
  }
  
  return result;
}

/**
 * Format time slot for display (e.g., "09:00" -> "9:00 AM")
 */
export function formatTimeDisplay(timeSlot: string): string {
  if (!timeSlot) return '';
  
  const [hour, minute] = timeSlot.split(':').map(Number);
  
  // Handle 24-hour time format
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12; // Convert 0 to 12 for 12 AM
  const displayMinute = minute ? `:${minute.toString().padStart(2, '0')}` : ':00';
  
  return `${displayHour}${displayMinute} ${period}`;
}
