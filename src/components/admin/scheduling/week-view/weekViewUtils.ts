
import { CalendarEvent } from '../context/calendarTypes';

export interface AvailabilitySlot {
  dayOfWeek: number;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  userId: string;
  userName?: string;
  category?: string;
}

export const isTimeAvailable = (
  hour: number, 
  dayOfWeek: number, 
  availabilitySlots: AvailabilitySlot[]
): boolean => {
  // If no slots defined yet, assume all times available
  if (!availabilitySlots || availabilitySlots.length === 0) {
    return true;
  }

  // Check if this hour falls within any availability slot for this day
  return availabilitySlots.some(slot => {
    if (slot.dayOfWeek !== dayOfWeek) return false;
    
    // Check if the hour is within the slot's time range
    if (slot.startHour <= hour && (
      slot.endHour > hour || 
      (slot.endHour === hour && slot.endMinute > 0)
    )) {
      return true;
    }
    
    return false;
  });
};

export const calculateEventPosition = (event: CalendarEvent) => {
  const start = event.start;
  const end = event.end;
  
  // Calculate position and height
  const startHour = start.getHours();
  const startMinute = start.getMinutes();
  const endHour = end.getHours();
  const endMinute = end.getMinutes();
  
  // Each hour is 60px height
  const top = (startHour * 60) + (startMinute);
  const height = ((endHour - startHour) * 60) + (endMinute - startMinute);
  
  return {
    top: `${top}px`,
    height: `${height}px`,
    left: '10%',
    width: '80%',
    backgroundColor: event.color || '#4285F4',
  };
};

export const getCategoryColor = (category?: string): string => {
  switch (category?.toLowerCase()) {
    case 'session':
      return '#4285F4'; // Blue
    case 'general':
      return '#0f9d58'; // Green
    case 'teaching':
      return '#f4b400'; // Yellow
    case 'practice':
      return '#db4437'; // Red
    case 'performance':
      return '#673ab7'; // Purple
    case 'meeting':
      return '#ff6d01'; // Orange
    default:
      return '#9aa0a6'; // Gray
  }
};
