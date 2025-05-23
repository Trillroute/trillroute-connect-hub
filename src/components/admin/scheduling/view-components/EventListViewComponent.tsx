
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
  
  console.log(`EventListViewComponent rendering with ${events.length} events`);
  
  return (
    <ScrollArea className="h-full">
      <EventListView 
        events={events}
        onEditEvent={onEditEvent} 
        onDeleteEvent={onDeleteEvent}
        showAvailability={showAvailability}
      />
    </ScrollArea>
  );
};
