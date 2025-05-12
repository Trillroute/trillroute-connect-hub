
import { UserAvailability } from '../context/calendarTypes';
import { format, isValid, parseISO } from 'date-fns';

// Function to format time for display
export const formatTimeDisplay = (timeStr: string): string => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes === 0 ? '00' : minutes.toString().padStart(2, '0')} ${period}`;
};

// Helper function to safely parse date objects
const safelyGetDate = (date: Date | string): Date | null => {
  if (date instanceof Date) {
    return isValid(date) ? date : null;
  }
  
  if (typeof date === 'string') {
    try {
      const parsedDate = parseISO(date);
      return isValid(parsedDate) ? parsedDate : null;
    } catch (error) {
      console.error("Invalid date string:", date);
      return null;
    }
  }
  
  return null;
};

// Get time slots from events and availabilities
export const getTimeSlots = (events: any[], availabilities: any) => {
  const slots = new Set<string>();
  
  console.log(`Getting time slots from ${events.length} events and ${Object.keys(availabilities).length} availability sets`);
  
  // Add times from events
  events.forEach(event => {
    if (!event) return;
    
    const startDate = safelyGetDate(event.start);
    if (startDate) {
      const hours = startDate.getHours();
      const minutes = startDate.getMinutes();
      const formattedTime = `${hours}:${minutes === 0 ? '00' : minutes}`;
      slots.add(formattedTime);
    }
  });
  
  // Add times from availabilities
  Object.values(availabilities).forEach((userData: any) => {
    if (userData && userData.slots && Array.isArray(userData.slots)) {
      userData.slots.forEach((slot: UserAvailability) => {
        if (slot && slot.startTime) {
          const [hours, minutes] = slot.startTime.split(':');
          if (hours && minutes) {
            slots.add(`${parseInt(hours)}:${minutes}`);
          }
        }
      });
    }
  });
  
  // If no slots found, add default time slots
  if (slots.size === 0) {
    ['9:00', '10:00', '11:00', '14:00', '15:00', '16:00'].forEach(time => slots.add(time));
  }
  
  // Sort time slots
  return Array.from(slots).sort((a, b) => {
    const [aHours, aMinutes] = a.split(':').map(Number);
    const [bHours, bMinutes] = b.split(':').map(Number);
    
    if (aHours !== bHours) return aHours - bHours;
    return aMinutes - bMinutes;
  });
};

// Get days of the week starting from current date
export const getDaysOfWeek = (currentDate: Date) => {
  const days = [];
  // Ensure we have a valid date object
  const startDate = currentDate instanceof Date && isValid(currentDate) ? 
                    new Date(currentDate) : 
                    new Date();
  
  // Start from Monday of current week
  const day = startDate.getDay();
  const diff = startDate.getDate() - day + (day === 0 ? -6 : 1);
  startDate.setDate(diff);
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    days.push({
      name: new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date),
      date,
      dayOfWeek: i + 1 // 1-7 (Monday-Sunday)
    });
  }
  
  return days;
};
