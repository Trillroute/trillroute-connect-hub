
import React from 'react';
import { format, isSameDay, isWithinInterval } from 'date-fns';
import { useCalendar } from './CalendarContext';
import { getWeekDays, getHourCells } from './calendarUtils';

interface WeekViewProps {
  onCreateEvent: () => void;
}

const WeekView: React.FC<WeekViewProps> = ({ onCreateEvent }) => {
  const { currentDate, events } = useCalendar();
  
  // Generate days and hours for the week view
  const weekDays = getWeekDays(currentDate);
  const hours = getHourCells();
  
  // Getting events for each day
  const getEventsForDay = (date: Date) => {
    return events.filter(event => 
      isSameDay(event.start, date)
    );
  };
  
  // Position calculation for events
  const calculateEventPosition = (event: typeof events[0], day: Date) => {
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

  return (
    <div className="relative h-full">
      {/* Time column */}
      <div className="flex">
        {/* Corner cell */}
        <div className="w-16 border-b border-r border-gray-200 bg-white">
          <div className="text-xs text-gray-500 h-12 flex items-center justify-center">
            GMT+05:30
          </div>
        </div>
        
        {/* Day headers */}
        {weekDays.map((day, i) => (
          <div
            key={i}
            className={`flex-1 border-b border-r border-gray-200 h-12 ${
              isSameDay(day, new Date()) ? 'bg-blue-50' : 'bg-white'
            }`}
          >
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-xs uppercase text-gray-500">{format(day, 'EEE')}</div>
              <div className={`text-base font-medium ${
                isSameDay(day, new Date()) ? 'text-blue-600' : ''
              }`}>
                {format(day, 'd')}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Time grid */}
      <div className="flex overflow-y-auto" style={{ height: 'calc(100% - 48px)' }}>
        {/* Time labels */}
        <div className="w-16 flex-shrink-0">
          {hours.map(hour => (
            <div 
              key={hour} 
              className="relative h-[60px] border-b border-r border-gray-200"
            >
              <div className="absolute -top-3 right-2 text-xs text-gray-500">
                {hour === 12 ? '12 PM' : hour < 12 ? `${hour} AM` : `${hour-12} PM`}
              </div>
            </div>
          ))}
        </div>
        
        {/* Day columns */}
        {weekDays.map((day, dayIndex) => (
          <div 
            key={dayIndex} 
            className="flex-1 relative"
          >
            {/* Hour cells */}
            {hours.map(hour => (
              <div
                key={hour}
                className={`h-[60px] border-b border-r border-gray-200 ${
                  isSameDay(day, new Date()) ? 'bg-blue-50' : ''
                }`}
                onClick={() => onCreateEvent()}
              ></div>
            ))}
            
            {/* Events */}
            <div className="absolute top-0 left-0 right-0">
              {getEventsForDay(day).map((event, eventIndex) => (
                <div
                  key={eventIndex}
                  className="absolute left-1 right-1 rounded px-2 py-1 text-white overflow-hidden text-sm"
                  style={calculateEventPosition(event, day)}
                >
                  <div className="font-semibold">{event.title}</div>
                  <div className="text-xs opacity-90">
                    {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekView;
