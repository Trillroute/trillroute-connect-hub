
import { CalendarEvent } from '../context/calendarTypes';

// Position calculation for events
export const calculateEventPosition = (event: CalendarEvent) => {
  if (!event || !event.start || !event.end) {
    console.error("Invalid event data:", event);
    return { top: "0px", height: "0px", backgroundColor: "#ccc" };
  }

  const startHour = event.start.getHours();
  const startMinute = event.start.getMinutes();
  const endHour = event.end.getHours();
  const endMinute = event.end.getMinutes();
  
  const startPercentage = ((startHour - 7) + startMinute / 60) * 60; // 60px per hour
  const duration = (endHour - startHour) + (endMinute - startMinute) / 60;
  const height = Math.max(20, duration * 60); // Minimum 20px for visibility
  
  return {
    top: `${startPercentage}px`,
    height: `${height}px`,
    backgroundColor: event.color || '#4285F4',
  };
};

// Define AvailabilitySlot interface for use in utility functions
export interface AvailabilitySlot {
  dayOfWeek: number;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  userId: string;
  userName?: string;
  category: string;
}

// Check if a time slot has availability for a specific day
export const isTimeAvailable = (hour: number, dayOfWeek: number, availabilitySlots: AvailabilitySlot[]) => {
  if (!availabilitySlots || availabilitySlots.length === 0) {
    return false;
  }
  
  // Ensure dayOfWeek is using the correct numbering (0 = Sunday, 6 = Saturday)
  const normalizedDayOfWeek = dayOfWeek === 7 ? 0 : dayOfWeek;
  
  return availabilitySlots.some(slot => {
    // Also normalize slot.dayOfWeek if needed
    const slotDayOfWeek = slot.dayOfWeek === 7 ? 0 : slot.dayOfWeek;
    
    // Check if the hour falls within the slot's time range
    return slotDayOfWeek === normalizedDayOfWeek && 
           (slot.startHour < hour || (slot.startHour === hour && slot.startMinute === 0)) && 
           (slot.endHour > hour || (slot.endHour === hour && slot.endMinute > 0));
  });
};

// Map category to CSS classes for styling
export const getCategoryColor = (category: string) => {
  if (!category) return 'bg-gray-100 border-gray-300 text-gray-800';
  
  switch (category.toLowerCase()) {
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
