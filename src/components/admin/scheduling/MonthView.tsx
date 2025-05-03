
import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { useCalendar } from './CalendarContext';
import { CalendarEvent } from './types';
import { cn } from "@/lib/utils";

interface MonthViewProps {
  onDateClick: (date: Date) => void;
}

const MonthView: React.FC<MonthViewProps> = ({ onDateClick }) => {
  const { currentDate, events } = useCalendar();
  
  // Generate days for the month
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Get first day of month and adjust for grid layout (0 = Sunday, 6 = Saturday)
  const firstDayOfMonth = monthStart.getDay();
  
  // Function to get events for a specific day
  const getEventsForDay = (date: Date) => {
    return events.filter(event => isSameDay(event.start, date));
  };

  // Generate weeks (rows)
  const weeks = [];
  let days = [];
  
  // Add empty cells for days before the first of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  
  // Add actual month days
  for (const day of monthDays) {
    days.push(day);
    
    // Start a new week when we reach Saturday (6)
    if (days.length === 7) {
      weeks.push(days);
      days = [];
    }
  }
  
  // Add empty cells for remaining days in the last week
  if (days.length > 0) {
    while (days.length < 7) {
      days.push(null);
    }
    weeks.push(days);
  }
  
  return (
    <div className="h-full overflow-auto p-2">
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
          <div key={i} className="text-center py-2 font-semibold text-sm">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {weeks.flat().map((day, i) => (
          <div
            key={i}
            className={cn(
              "min-h-[100px] border rounded-md p-1",
              day ? (
                isToday(day) 
                  ? "bg-blue-50 border-blue-200" 
                  : isSameMonth(day, currentDate) 
                    ? "bg-white" 
                    : "bg-gray-50 text-gray-400"
              ) : "bg-gray-50",
              day && "cursor-pointer hover:bg-gray-50"
            )}
            onClick={() => day && onDateClick(day)}
          >
            {day && (
              <>
                <div className="text-right text-sm font-medium">
                  {format(day, 'd')}
                </div>
                <div className="mt-1">
                  {getEventsForDay(day).slice(0, 3).map((event, eventIndex) => (
                    <div 
                      key={eventIndex}
                      className="text-xs truncate rounded px-1 py-0.5 mb-1 text-white"
                      style={{ backgroundColor: event.color || '#4285F4' }}
                    >
                      {event.title}
                    </div>
                  ))}
                  {getEventsForDay(day).length > 3 && (
                    <div className="text-xs text-gray-600">
                      +{getEventsForDay(day).length - 3} more
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthView;
