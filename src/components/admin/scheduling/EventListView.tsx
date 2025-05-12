
import React, { useState, useMemo } from 'react';
import { format, isAfter, startOfDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Pencil, Trash2, Calendar } from 'lucide-react';
import { CalendarEvent } from './context/calendarTypes';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface EventListViewProps {
  events: CalendarEvent[];
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (event: CalendarEvent) => void;
}

const EventListView: React.FC<EventListViewProps> = ({ events, onEditEvent, onDeleteEvent }) => {
  const [displayCount, setDisplayCount] = useState<number>(20);
  
  // Filter events to only show future events
  const upcomingEvents = useMemo(() => {
    console.log(`Processing ${events.length} total events for list view`);
    const now = new Date();
    const today = startOfDay(now);
    
    // Filter to only include events that start after now
    const filteredEvents = events
      .filter(event => isAfter(event.start, now))
      .sort((a, b) => a.start.getTime() - b.start.getTime());
    
    console.log(`Found ${filteredEvents.length} upcoming events`);
    return filteredEvents;
  }, [events]);
  
  // Get the limited set of events to display based on the displayCount
  const displayedEvents = upcomingEvents.slice(0, displayCount);
  
  // Function to load more events
  const handleShowMore = () => {
    setDisplayCount(prevCount => prevCount + 20);
  };
  
  if (events.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="bg-muted rounded-full p-3 mb-4">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">No events scheduled</h3>
            <p className="text-muted-foreground text-center">
              No upcoming events found in your calendar.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-6">
      {displayedEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <div className="text-gray-500 text-center">
            <div className="text-lg mb-2">No upcoming events</div>
            <div className="text-sm">All scheduled events have passed</div>
          </div>
        </div>
      ) : (
        <>
          {/* Event list */}
          <div className="space-y-4">
            {displayedEvents.map((event) => (
              <div 
                key={event.id} 
                className="border rounded-md p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium">{event.title}</h3>
                  <Badge variant="outline" className="font-normal">
                    {format(event.start, 'MMMM d, yyyy')}
                  </Badge>
                </div>
                
                <div className="flex items-center text-gray-500 mb-2">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                  </span>
                </div>
                
                {event.location && (
                  <div className="flex items-center text-gray-500 mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                )}
                
                {event.description && (
                  <p className="mt-2 text-sm text-gray-600 mb-4">{event.description}</p>
                )}
                
                <div className="flex justify-between items-center mt-4">
                  <div
                    className="w-1/3 h-2 rounded"
                    style={{ backgroundColor: event.color || '#4285F4' }}
                  ></div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onEditEvent(event)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 hover:text-red-600" 
                      onClick={() => onDeleteEvent(event)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Show more button */}
          {displayedEvents.length < upcomingEvents.length && (
            <div className="flex justify-center mt-6">
              <Button 
                variant="outline" 
                onClick={handleShowMore}
                className="w-full max-w-sm"
              >
                Show More ({upcomingEvents.length - displayedEvents.length} events remaining)
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EventListView;
