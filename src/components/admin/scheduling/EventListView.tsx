
import React from 'react';
import { format, isSameDay, isSameMonth, isWithinInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { useCalendar } from './context/CalendarContext';
import { CalendarEvent } from './context/calendarTypes';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Pencil, Trash2 } from 'lucide-react';

interface EventListViewProps {
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (event: CalendarEvent) => void;
}

const EventListView: React.FC<EventListViewProps> = ({ onEditEvent, onDeleteEvent }) => {
  const { currentDate, events, viewMode, handleDateSelect } = useCalendar();
  
  // Filter events based on the selected view mode
  const filteredEvents = React.useMemo(() => {
    // For list view, always show events for the current day only
    const todayEvents = events.filter(event => isSameDay(event.start, currentDate))
      .sort((a, b) => a.start.getTime() - b.start.getTime());
    
    console.log(`List view showing ${todayEvents.length} events for ${format(currentDate, 'yyyy-MM-dd')}`);
    return todayEvents;
  }, [events, currentDate]);
  
  // Get an appropriate title based on current date
  const getViewTitle = () => {
    return `Events for ${format(currentDate, 'EEEE, MMMM d, yyyy')}`;
  };
  
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-lg font-semibold px-6 py-4">
        {getViewTitle()}
      </h2>
      
      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        {filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full bg-gray-50 rounded-lg p-8 border border-dashed border-gray-300">
            <div className="text-gray-500 text-center mb-6">
              <div className="text-lg mb-2">No events scheduled for today</div>
              <div className="text-sm">Click on the calendar to add a new event</div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map((event, index) => (
              <div 
                key={index} 
                className="border rounded-md p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
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
                  <div className="flex space-x-1">
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
        )}
      </div>
    </div>
  );
};

export default EventListView;
