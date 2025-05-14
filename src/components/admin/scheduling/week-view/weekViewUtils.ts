
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

export function calculateEventPosition(event: CalendarEvent): React.CSSProperties {
  const startHour = event.start.getHours();
  const startMinute = event.start.getMinutes();
  const endHour = event.end.getHours();
  const endMinute = event.end.getMinutes();
  
  // Calculate start position from top (hours from 00:00)
  const startFromMidnight = startHour + startMinute / 60;
  
  // Calculate event duration in hours
  const durationHours = (endHour - startHour) + (endMinute - startMinute) / 60;
  
  return {
    top: `${startFromMidnight * 60}px`,
    height: `${durationHours * 60}px`,
    width: 'calc(100% - 10px)',
    left: '5px',
    backgroundColor: event.color || '#4285F4',
    zIndex: 10
  };
}

export function isTimeAvailable(hour: number, dayIndex: number, availabilitySlots: AvailabilitySlot[]): boolean {
  // Check if any availability slot covers this time
  return availabilitySlots.some(slot => 
    slot.dayOfWeek === dayIndex && 
    slot.startHour <= hour && 
    slot.endHour > hour
  );
}
