
import React from 'react';
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
  
  console.log(`EventListViewComponent: Rendering with ${events.length} events`);
  console.log('EventListViewComponent: Events data:', events);
  
  return (
    <ScrollArea className="h-full">
      <div className="p-4">
        {events.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No events found</p>
            <p className="text-sm mt-2">Try adjusting your filters or create a new event</p>
          </div>
        ) : (
          <EventListView 
            events={events}
            onEditEvent={onEditEvent} 
            onDeleteEvent={onDeleteEvent}
            showAvailability={showAvailability}
          />
        )}
      </div>
    </ScrollArea>
  );
};
