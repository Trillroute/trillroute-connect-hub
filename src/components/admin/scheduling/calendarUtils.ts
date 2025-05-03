
import { format, startOfWeek, endOfWeek, addDays } from 'date-fns';
import { CalendarEvent } from './types';

// Format calendar title based on view mode
export const formatCalendarTitle = (currentDate: Date, viewMode: string): string => {
  if (viewMode === 'week') {
    const start = startOfWeek(currentDate, { weekStartsOn: 0 });
    const end = endOfWeek(currentDate, { weekStartsOn: 0 });
    
    // If same month
    if (start.getMonth() === end.getMonth()) {
      return `${format(start, 'MMMM')} ${format(start, 'yyyy')}`;
    }
    // If different months
    return `${format(start, 'MMM')} – ${format(end, 'MMM')} ${format(end, 'yyyy')}`;
  }
  return format(currentDate, 'MMMM yyyy');
};

// Generate days for the week view
export const getWeekDays = (currentDate: Date): Date[] => {
  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 0 });
  return Array.from({ length: 7 }).map((_, i) => addDays(startOfCurrentWeek, i));
};

// Generate hours for the time grid (7 AM to 8 PM)
export const getHourCells = (): number[] => {
  return Array.from({ length: 14 }).map((_, i) => i + 7);
};

// Initialize sample events for the calendar
export const initializeSampleEvents = (): CalendarEvent[] => {
  const today = new Date();
  return [
    {
      id: '1',
      title: 'Piano Lesson',
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 0),
      color: '#4285F4'
    },
    {
      id: '2',
      title: 'Guitar Class',
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 14, 0),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 15, 30),
      color: '#0F9D58'
    },
    {
      id: '3',
      title: 'Violin Recital',
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 16, 0),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 18, 0),
      color: '#F4B400'
    },
  ];
};
