
import { UserAvailability } from '../context/calendarTypes';

// Function to format time for display
export const formatTimeDisplay = (timeStr: string): string => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes === 0 ? '00' : minutes.toString().padStart(2, '0')} ${period}`;
};

// Get time slots from events and availabilities
export const getTimeSlots = (events: any[], availabilities: any) => {
  const slots = new Set<string>();
  
  // Add times from events
  events.forEach(event => {
    const hours = event.start.getHours();
    const minutes = event.start.getMinutes();
    const formattedTime = `${hours}:${minutes === 0 ? '00' : minutes}`;
    slots.add(formattedTime);
  });
  
  // Add times from availabilities
  Object.values(availabilities).forEach((userData: any) => {
    userData.slots.forEach((slot: UserAvailability) => {
      const [hours, minutes] = slot.startTime.split(':');
      slots.add(`${parseInt(hours)}:${minutes}`);
    });
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
  const startDate = new Date(currentDate);
  
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
