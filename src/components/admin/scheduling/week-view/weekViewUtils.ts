
import { CalendarEvent } from '../context/calendarTypes';

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

// Get category background class - matching the same function in legacy-view/utils.ts
export const getCategoryColor = (category: string) => {
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

// Calculate event position and size
export const calculateEventPosition = (event: CalendarEvent) => {
  // Hours in calendar view start from 7:00 AM (0 minutes) to 7:00 PM (720 minutes)
  const startHour = event.start.getHours();
  const startMinute = event.start.getMinutes();
  const endHour = event.end.getHours();
  const endMinute = event.end.getMinutes();
  
  // Calculate minutes from 7:00 AM
  const startMinutesFromReference = ((startHour - 7) * 60) + startMinute;
  
  // Calculate event duration in minutes
  const durationMinutes = ((endHour - startHour) * 60) + (endMinute - startMinute);
  
  // Make sure events have a minimum height for visibility
  const height = Math.max(20, durationMinutes);
  
  return {
    top: `${startMinutesFromReference}px`,
    height: `${height}px`,
    left: '10%',
    width: '80%',
    position: 'absolute' as const,
  };
};

// Check if a specific time is available
export const isTimeAvailable = (hour: number, dayIndex: number, availabilitySlots: AvailabilitySlot[]): boolean => {
  // Filter slots for this day and time
  const slotsForDay = availabilitySlots.filter(slot => 
    slot.dayOfWeek === dayIndex
  );
  
  // Check if any slot overlaps with this hour
  return slotsForDay.some(slot => {
    return (hour >= slot.startHour && hour < slot.endHour);
  });
};

// Get event color - matching exactly with the colors in legacy-view/utils.ts
export const getEventColor = (category: string): string => {
  switch(category?.toLowerCase() || '') {
    case 'session':
      return '#10B981'; // green-700
    case 'break':
      return '#3B82F6'; // blue-600
    case 'office':
      return '#8B5CF6'; // purple-600
    case 'meeting':
      return '#F59E0B'; // yellow-500
    case 'class setup':
      return '#F97316'; // orange-500
    case 'qc':
      return '#EC4899'; // pink-600
    default:
      return '#10B981'; // Default to green
  }
};
