
import React from 'react';
import { format, isSameDay, isSameMonth, isWithinInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { useCalendar } from './CalendarContext';
import { CalendarEvent } from './types';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Clock, MapPin, Pencil, Trash2, CalendarIcon } from 'lucide-react';

interface EventListViewProps {
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (event: CalendarEvent) => void;
}

const EventListView: React.FC<EventListViewProps> = ({ onEditEvent, onDeleteEvent }) => {
  const { currentDate, events, viewMode, handleDateSelect } = useCalendar();
  
  // Filter events based on the selected view mode
  const filteredEvents = React.useMemo(() => {
    switch (viewMode) {
      case 'day':
        // For day view, show events for the selected day
        return events.filter(event => isSameDay(event.start, currentDate))
          .sort((a, b) => a.start.getTime() - b.start.getTime());
      
      case 'week':
        // For week view, show events for the entire week
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 }); // 0 = Sunday
        const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
        
        return events.filter(event => 
          isWithinInterval(event.start, { start: weekStart, end: weekEnd })
        ).sort((a, b) => {
          // First sort by day
          if (a.start.getDate() !== b.start.getDate()) {
            return a.start.getTime() - b.start.getTime();
          }
          // Then sort by time if on the same day
          return a.start.getTime() - b.start.getTime();
        });
      
      case 'month':
        // For month view, show events for the entire month
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        
        return events.filter(event => 
          isWithinInterval(event.start, { start: monthStart, end: monthEnd })
        ).sort((a, b) => a.start.getTime() - b.start.getTime());
      
      default:
        return [];
    }
  }, [events, currentDate, viewMode]);
  
  // Get an appropriate title based on the view mode
  const getViewTitle = () => {
    switch (viewMode) {
      case 'day':
        return `Events for ${format(currentDate, 'EEEE, MMMM d, yyyy')}`;
      case 'week':
        return `Events for week of ${format(startOfWeek(currentDate, { weekStartsOn: 0 }), 'MMMM d')} - ${format(endOfWeek(currentDate, { weekStartsOn: 0 }), 'MMMM d, yyyy')}`;
      case 'month':
        return `Events for ${format(currentDate, 'MMMM yyyy')}`;
      default:
        return 'Events';
    }
  };
  
  // Group events by date for week and month views
  const groupedEvents = React.useMemo(() => {
    if (viewMode === 'day') {
      // No need to group for day view
      return { [format(currentDate, 'yyyy-MM-dd')]: filteredEvents };
    }

    // For week and month views, group events by date
    const grouped: { [key: string]: CalendarEvent[] } = {};
    
    filteredEvents.forEach(event => {
      const dateKey = format(event.start, 'yyyy-MM-dd');
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });
    
    // Sort the keys to ensure chronological order
    return Object.keys(grouped)
      .sort()
      .reduce((result: { [key: string]: CalendarEvent[] }, date) => {
        result[date] = grouped[date];
        return result;
      }, {});
  }, [filteredEvents, viewMode, currentDate]);
  
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-4 p-4 pb-0">
        {getViewTitle()}
      </h2>
      
      <div className="flex-1 p-4 overflow-y-auto">
        {filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-gray-500 text-center mb-6">
              <div className="text-lg mb-2">No events scheduled for this {viewMode}</div>
              <div className="text-sm">Click on the calendar to add a new event</div>
            </div>
            
            {/* Always show a calendar view even when there are no events */}
            <div className="mt-4 border rounded-md p-4 bg-white shadow-sm w-full max-w-md mx-auto">
              <Calendar
                mode="single"
                selected={currentDate}
                onSelect={handleDateSelect}
                className="mx-auto"
                initialFocus
              />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedEvents).map(([dateKey, dateEvents]) => (
              <div key={dateKey} className="mb-6">
                {/* Show date headers for week and month views */}
                {viewMode !== 'day' && (
                  <h3 className="font-medium text-gray-700 mb-2 border-b pb-1">
                    {format(new Date(dateKey), 'EEEE, MMMM d, yyyy')}
                  </h3>
                )}
                
                <div className="space-y-4">
                  {dateEvents.map((event, index) => (
                    <div 
                      key={index} 
                      className="border rounded-md p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium">{event.title}</h3>
                          <div className="flex items-center text-gray-500 mt-2">
                            <Clock className="w-4 h-4 mr-1" />
                            <span className="text-sm">
                              {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                            </span>
                          </div>
                          {event.location && (
                            <div className="flex items-center text-gray-500 mt-1">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span className="text-sm">{event.location}</span>
                            </div>
                          )}
                          {event.description && (
                            <p className="mt-2 text-sm text-gray-600">{event.description}</p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8" 
                            onClick={() => onEditEvent(event)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 text-red-500 hover:text-red-600" 
                            onClick={() => onDeleteEvent(event)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div
                        className="w-full h-1 mt-4"
                        style={{ backgroundColor: event.color || '#4285F4' }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventListView;
