
import React, { useEffect } from 'react';
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
  const { events, refreshEvents } = useCalendar();
  
  // Force refresh events when the component mounts
  useEffect(() => {
    console.log(`EventListViewComponent mounting, refreshing events`);
    refreshEvents();
  }, [refreshEvents]);
  
  console.log(`EventListViewComponent rendering with ${events.length} events`);
  
  return (
    <div className="h-full overflow-auto">
      <EventListView 
        events={events}
        onEditEvent={onEditEvent} 
        onDeleteEvent={onDeleteEvent} 
      />
    </div>
  );
};
