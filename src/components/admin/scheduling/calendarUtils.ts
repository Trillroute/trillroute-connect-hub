
import { format, startOfWeek, endOfWeek, addDays } from 'date-fns';

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
