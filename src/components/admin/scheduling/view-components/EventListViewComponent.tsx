
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
  const { events, refreshEvents, currentDate } = useCalendar();
  
  // Force refresh events when the component mounts or when the date changes
  useEffect(() => {
    console.log(`EventListViewComponent mounting/updating, refreshing events for date: ${currentDate.toDateString()}`);
    refreshEvents();
  }, [refreshEvents, currentDate]);
  
  console.log(`EventListViewComponent rendering with ${events.length} events, current date: ${currentDate.toDateString()}`);
  
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
