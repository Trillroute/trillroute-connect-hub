
import React from 'react';
import { CalendarEvent } from '../context/calendarTypes';
import { useCalendar } from '../context/CalendarContext';
import { useFilteredEvents } from './FilteredEventsProvider';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, isSameDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import existing components instead of the missing ones
import WeekDayHeader from '../week-view/WeekDayHeader';

interface WeekViewComponentProps {
  onCreateEvent: () => void;
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (event: CalendarEvent) => void;
  onDateClick: (date: Date) => void;
  showFilterTabs?: boolean; // We'll keep this prop but not use it since we're removing filter tabs
}

export const WeekViewComponent: React.FC<WeekViewComponentProps> = ({ 
  onCreateEvent, 
  onEditEvent, 
  onDeleteEvent, 
  onDateClick
}) => {
  const { currentDate, setCurrentDate } = useCalendar();
  const { filteredEvents } = useFilteredEvents();
  
  // Get the start and end of the week for the current date
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start on Monday
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 }); // End on Sunday
  
  // Get all days in the week
  const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  // Navigate to previous week
  const goToPreviousWeek = () => {
    setCurrentDate(addDays(currentDate, -7));
  };
  
  // Navigate to next week
  const goToNextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };
  
  // Navigate to today
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Event handler for clicking on calendar events
  const handleEventClick = (event: CalendarEvent) => {
    // Open the event for editing
    onEditEvent(event);
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Removed the filter tabs section that was causing duplication */}
      
      <div className="flex justify-between items-center p-2 border-b">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <h3 className="text-lg font-semibold">
          {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
        </h3>
      </div>
      
      <div className="flex-grow overflow-auto">
        <div className="flex flex-col h-full">
          {/* Day headers */}
          <div className="flex">
            {/* Corner cell */}
            <div className="w-16 border-b border-r border-gray-200 bg-white">
              <div className="text-xs text-gray-500 h-12 flex items-center justify-center">
                Time
              </div>
            </div>
            
            {/* Day headers */}
            {daysInWeek.map((day, i) => (
              <WeekDayHeader key={i} day={day} currentDate={currentDate} />
            ))}
          </div>
          
          {/* Time grid with events */}
          <div className="flex h-[calc(100%-48px)] relative">
            {/* Time labels */}
            <div className="w-16 flex-shrink-0">
              {Array.from({ length: 14 }, (_, i) => i + 7).map(hour => (
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
            {daysInWeek.map((day, dayIndex) => (
              <div key={dayIndex} className="flex-1 relative">
                {/* Hour cells */}
                <div>
                  {Array.from({ length: 14 }, (_, i) => i + 7).map(hour => (
                    <div
                      key={hour}
                      className={`h-[60px] border-b border-r border-gray-200 
                        ${isSameDay(day, new Date()) ? 'bg-blue-50' : ''}`}
                      onClick={() => onDateClick(new Date(day.setHours(hour)))}
                    ></div>
                  ))}
                </div>
                
                {/* Events */}
                <div className="absolute top-0 left-0 right-0">
                  {filteredEvents
                    .filter(event => isSameDay(event.start, day))
                    .map((event, eventIndex) => {
                      const startHour = event.start.getHours();
                      const startMinutes = event.start.getMinutes();
                      const endHour = event.end.getHours();
                      const endMinutes = event.end.getMinutes();
                      
                      const startPercentage = ((startHour - 7) + startMinutes / 60) * 60;
                      const duration = (endHour - startHour) + (endMinutes - startMinutes) / 60;
                      const height = duration * 60;
                      
                      return (
                        <div
                          key={eventIndex}
                          className={`absolute left-1 right-1 rounded px-2 py-1 text-white overflow-hidden text-sm cursor-pointer`}
                          style={{
                            top: `${startPercentage}px`,
                            height: `${Math.max(height, 25)}px`,
                            backgroundColor: event.color || '#4285F4'
                          }}
                          onClick={() => handleEventClick(event)}
                        >
                          <div className="font-semibold">{event.title}</div>
                          <div className="text-xs opacity-90">
                            {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
