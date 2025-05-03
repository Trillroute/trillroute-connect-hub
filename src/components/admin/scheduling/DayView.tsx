
import React from 'react';
import { format, isSameDay } from 'date-fns';
import { useCalendar } from './CalendarContext';
import { getHourCells } from './calendarUtils';
import { CalendarEvent } from './types';
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from 'lucide-react';

interface DayViewProps {
  onCreateEvent: () => void;
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (event: CalendarEvent) => void;
}

const DayView: React.FC<DayViewProps> = ({ onCreateEvent, onEditEvent, onDeleteEvent }) => {
  const { currentDate, events } = useCalendar();
  const hours = getHourCells();
  
  // Filter events for the current day
  const todayEvents = events.filter(event => 
    isSameDay(event.start, currentDate)
  );
  
  // Position calculation for events
  const calculateEventPosition = (event: CalendarEvent) => {
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
    <div className="flex h-full">
      {/* Time column */}
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
      
      {/* Day column */}
      <div className="flex-1 relative">
        {/* Date header */}
        <div className="h-12 border-b border-r border-gray-200 bg-white flex items-center justify-center">
          <div className="text-lg font-semibold">
            {format(currentDate, 'EEEE, MMMM d')}
          </div>
        </div>

        {/* Hour cells */}
        <div className="relative">
          {hours.map(hour => (
            <div
              key={hour}
              className="h-[60px] border-b border-r border-gray-200"
              onClick={onCreateEvent}
            ></div>
          ))}
          
          {/* Events */}
          <div className="absolute top-0 left-0 right-0">
            {todayEvents.map((event, eventIndex) => (
              <div
                key={eventIndex}
                className="absolute left-1 right-1 rounded px-2 py-1 text-white overflow-hidden text-sm group cursor-pointer"
                style={calculateEventPosition(event)}
                onClick={() => onEditEvent(event)}
              >
                <div className="font-semibold group-hover:underline">{event.title}</div>
                <div className="text-xs opacity-90">
                  {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                </div>
                <div className="absolute top-1 right-1 hidden group-hover:flex gap-1">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-5 w-5 bg-white/20 hover:bg-white/40"
                    onClick={(e) => { 
                      e.stopPropagation();
                      onEditEvent(event);
                    }}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-5 w-5 bg-white/20 hover:bg-white/40"
                    onClick={(e) => { 
                      e.stopPropagation();
                      onDeleteEvent(event);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayView;
