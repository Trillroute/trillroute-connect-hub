
import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useCalendar } from '../context/CalendarContext';
import { useStaffAvailability } from '@/hooks/useStaffAvailability';

interface MonthViewComponentProps {
  onDateClick: (date: Date) => void;
}

export const MonthViewComponent: React.FC<MonthViewComponentProps> = ({
  onDateClick,
}) => {
  const { currentDate, events } = useCalendar();
  const [daysInMonth, setDaysInMonth] = useState<Date[]>([]);

  // Fetch staff availability
  const { availabilityByUser, loading } = useStaffAvailability();
  
  // Determine which days have availability slots
  const daysWithAvailability = React.useMemo(() => {
    const days = new Set<number>();
    
    if (!loading) {
      Object.values(availabilityByUser).forEach(userData => {
        if (userData.slots && Array.isArray(userData.slots)) {
          userData.slots.forEach(slot => {
            if (typeof slot.dayOfWeek === 'number') {
              days.add(slot.dayOfWeek);
            }
          });
        }
      });
    }
    
    return days;
  }, [availabilityByUser, loading]);

  useEffect(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start, end });
    setDaysInMonth(days);
  }, [currentDate]);

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === day.toDateString();
    });
  };

  // Check if a day has availability based on day of week
  const hasDayAvailability = (day: Date) => {
    return daysWithAvailability.has(day.getDay());
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">
        {format(currentDate, 'MMMM yyyy')}
      </h2>
      
      <div className="grid grid-cols-7 gap-2 font-semibold text-center mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2">{day}</div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {daysInMonth.map((day, i) => {
          const dayEvents = getEventsForDay(day);
          const hasAvailability = hasDayAvailability(day);
          
          return (
            <div
              key={i}
              className={`min-h-24 p-2 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors 
              ${!isSameMonth(day, currentDate) ? 'bg-gray-100' : ''}`}
              onClick={() => onDateClick(day)}
            >
              <div className="flex justify-between items-start">
                <span className={`text-lg ${day.getDay() === 0 || day.getDay() === 6 ? 'text-red-500' : ''}`}>
                  {format(day, 'd')}
                </span>
                <div className="flex flex-col gap-1">
                  {dayEvents.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {dayEvents.length} event{dayEvents.length > 1 ? 's' : ''}
                    </Badge>
                  )}
                  {hasAvailability && (
                    <Badge variant="outline" className="text-xs bg-blue-50">
                      Available
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="mt-2 space-y-1">
                {dayEvents.slice(0, 2).map((event, index) => (
                  <div key={index} className="text-xs truncate p-1 rounded-sm" style={{ backgroundColor: event.color || '#4285F4' }}>
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-gray-500">+ {dayEvents.length - 2} more</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
