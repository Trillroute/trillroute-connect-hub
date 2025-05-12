
import React from 'react';
import EventListView from '../EventListView';
import { CalendarEvent } from '../context/calendarTypes';
import { useCalendar } from '../context/CalendarContext';

interface EventListViewComponentProps {
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (event: CalendarEvent) => void;
}

export const EventListViewComponent: React.FC<EventListViewComponentProps> = ({
  onEditEvent,
  onDeleteEvent
}) => {
  const { events } = useCalendar();
  
  console.log(`EventListViewComponent rendering with ${events.length} events`);
  
  return (
    <div className="h-full overflow-auto">
      <EventListView 
        onEditEvent={onEditEvent} 
        onDeleteEvent={onDeleteEvent} 
      />
    </div>
  );
};
