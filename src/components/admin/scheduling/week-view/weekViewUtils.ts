
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
  // If no slots defined yet, assume all times available for flexibility
  if (!availabilitySlots || availabilitySlots.length === 0) {
    return true;
  }

  // Check if this hour falls within any availability slot for this day
  return availabilitySlots.some(slot => {
    if (slot.dayOfWeek !== dayOfWeek) return false;
    
    // Check if the hour is within the slot's time range (more precise calculation)
    const slotStartMinutes = (slot.startHour * 60) + slot.startMinute;
    const slotEndMinutes = (slot.endHour * 60) + slot.endMinute;
    const hourStartMinutes = hour * 60;
    const hourEndMinutes = (hour + 1) * 60;
    
    // Check for overlap between the hour and the slot
    return (
      (slotStartMinutes < hourEndMinutes) && 
      (slotEndMinutes > hourStartMinutes)
    );
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
  
  // Calculate in minutes for precise positioning
  // Each hour is 60px height
  const top = (startHour * 60) + startMinute;
  const height = ((endHour - startHour) * 60) + (endMinute - startMinute);
  
  // Ensure minimal height for visibility
  const minHeight = 20; // 20px minimum height
  
  return {
    top: `${top}px`,
    height: `${Math.max(height, minHeight)}px`,
    left: '10%',
    width: '80%',
    backgroundColor: event.color || '#4285F4',
    zIndex: 20, // Ensure events appear above availability indicators
  };
};

export const getCategoryColor = (category?: string): string => {
  switch (category?.toLowerCase()) {
    case 'session':
      return 'bg-green-100 border-green-300 text-green-800';
    case 'break':
      return 'bg-blue-100 border-blue-300 text-blue-800';
    case 'office':
      return 'bg-purple-100 border-purple-300 text-purple-800';
    case 'meeting':
      return 'bg-yellow-100 border-yellow-300 text-yellow-800';
    case 'class setup':
      return 'bg-orange-100 border-orange-300 text-orange-800';
    case 'qc':
      return 'bg-pink-100 border-pink-300 text-pink-800';
    default:
      return 'bg-gray-100 border-gray-300 text-gray-800';
  }
};
