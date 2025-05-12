
import { CalendarEvent } from '../context/calendarTypes';

// Position calculation for events
export const calculateEventPosition = (event: CalendarEvent) => {
  const startHour = event.start.getHours();
  const startMinute = event.start.getMinutes();
  const endHour = event.end.getHours();
  const endMinute = event.end.getMinutes();
  
  const startPercentage = ((startHour - 7) + startMinute / 60) * 60; // 60px per hour
  const duration = (endHour - startHour) + (endMinute - startMinute) / 60;
  const height = duration * 60; // 60px per hour
  
  return {
    top: `${startPercentage}px`,
    height: `${height}px`,
    backgroundColor: event.color || '#4285F4',
  };
};
