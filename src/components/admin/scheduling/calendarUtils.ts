
import { format, startOfWeek, endOfWeek, addDays, startOfMonth, endOfMonth } from 'date-fns';

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
  } else if (viewMode === 'day') {
    return format(currentDate, 'MMMM d, yyyy');
  }
  // Default (month)
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

// Get month days for the month view
export const getMonthDays = (currentDate: Date): Date[] => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = [];
  
  for (let day = monthStart; day <= monthEnd; day = addDays(day, 1)) {
    days.push(day);
  }
  
  return days;
};
