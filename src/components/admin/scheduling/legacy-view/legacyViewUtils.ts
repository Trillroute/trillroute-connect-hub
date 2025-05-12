
import { format, addDays, startOfDay } from 'date-fns';
import { CalendarEvent, UserAvailabilityMap } from '../context/calendarTypes';

// Format time for display
export const formatTimeDisplay = (timeSlot: string): string => {
  const [hours, minutes] = timeSlot.split(':').map(Number);
  const period = hours < 12 ? 'AM' : 'PM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

// Get days of the week starting from a given date
export const getDaysOfWeek = (startDate: Date): { name: string; date: Date; dayOfWeek: number }[] => {
  const days: { name: string; date: Date; dayOfWeek: number }[] = [];
  const start = startOfDay(startDate);

  // Add the current day and the next 6 days
  for (let i = 0; i < 7; i++) {
    const currentDate = addDays(start, i);
    const dayOfWeek = currentDate.getDay() || 7; // Convert Sunday (0) to 7 for consistency
    days.push({
      name: format(currentDate, 'EEEE'), // Full day name
      date: currentDate,
      dayOfWeek: dayOfWeek
    });
  }

  return days;
};

// Function to extract time slots from events and availabilities
export const getTimeSlots = (events: CalendarEvent[], availabilities: UserAvailabilityMap | undefined): string[] => {
  const timeSlots = new Set<string>();

  // Add time slots from events
  events.forEach(event => {
    const startHour = event.start.getHours();
    const startMinute = event.start.getMinutes();
    const endHour = event.end.getHours();
    const endMinute = event.end.getMinutes();
    
    // Add starting time
    timeSlots.add(`${startHour}:${startMinute === 0 ? '00' : startMinute}`);
    
    // Add ending time
    timeSlots.add(`${endHour}:${endMinute === 0 ? '00' : endMinute}`);
  });

  // Add time slots from availability
  if (availabilities) {
    Object.values(availabilities).forEach(userAvailability => {
      if (userAvailability && userAvailability.slots) {
        userAvailability.slots.forEach(slot => {
          if (slot.startTime) {
            const [startHour, startMinute] = slot.startTime.split(':');
            timeSlots.add(`${startHour}:${startMinute || '00'}`);
          }
          if (slot.endTime) {
            const [endHour, endMinute] = slot.endTime.split(':');
            timeSlots.add(`${endHour}:${endMinute || '00'}`);
          }
        });
      }
    });
  }

  // If no time slots found, add default business hours
  if (timeSlots.size === 0) {
    for (let i = 8; i <= 18; i++) {
      timeSlots.add(`${i}:00`);
    }
  }

  // Sort time slots
  return Array.from(timeSlots)
    .sort((a, b) => {
      const [hourA, minuteA] = a.split(':').map(Number);
      const [hourB, minuteB] = b.split(':').map(Number);
      
      if (hourA !== hourB) {
        return hourA - hourB;
      }
      return minuteA - minuteB;
    });
};
