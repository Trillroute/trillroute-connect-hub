
import React, { useMemo } from 'react';
import EventListView from '../EventListView';
import { CalendarEvent } from '../context/calendarTypes';
import { useCalendar } from '../context/CalendarContext';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EventListViewComponentProps {
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (event: CalendarEvent) => void;
  showAvailability?: boolean;
}

export const EventListViewComponent: React.FC<EventListViewComponentProps> = ({
  onEditEvent,
  onDeleteEvent,
  showAvailability = true
}) => {
  const { events } = useCalendar();
  
  // Use the events from context (which are already filtered by FilteredEventsProvider)
  const displayEvents = useMemo(() => {
    console.log(`EventListViewComponent: Processing ${events.length} events for display`);
    
    // Sort events by start date
    const sortedEvents = [...events].sort((a, b) => {
      if (!a.start || !b.start) return 0;
      return new Date(a.start).getTime() - new Date(b.start).getTime();
    });
    
    console.log('EventListViewComponent: Sorted events:', sortedEvents.map(e => ({
      title: e.title,
      start: e.start,
      eventType: e.eventType
    })));
    
    return sortedEvents;
  }, [events]);
  
  console.log(`EventListViewComponent: Rendering with ${displayEvents.length} events`);
  
  return (
    <ScrollArea className="h-full">
      <div className="p-4">
        {displayEvents.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No events found</p>
            <p className="text-sm mt-2">Try adjusting your filters or create a new event</p>
          </div>
        ) : (
          <div className="space-y-2 mb-4">
            <div className="text-sm text-muted-foreground">
              Showing {displayEvents.length} events
            </div>
            <EventListView 
              events={displayEvents}
              onEditEvent={onEditEvent} 
              onDeleteEvent={onDeleteEvent}
              showAvailability={showAvailability}
            />
          </div>
        )}
      </div>
    </ScrollArea>
  );
};
