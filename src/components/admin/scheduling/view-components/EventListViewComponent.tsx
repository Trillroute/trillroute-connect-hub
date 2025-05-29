
import React from 'react';
import { CalendarEvent } from '../context/calendarTypes';
import { EventListView } from '../EventListView';

interface EventListViewComponentProps {
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (event: CalendarEvent) => void;
  onCreateEvent?: () => void;
  showAvailability?: boolean;
  filterType?: 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | null;
  filterId?: string | null;
  filterIds?: string[];
  filters?: { users: string[]; courses: string[]; skills: string[] };
  // Accept the filtered events from ViewSelector
  events?: CalendarEvent[];
  availabilities?: any;
}

export const EventListViewComponent: React.FC<EventListViewComponentProps> = ({
  onEditEvent,
  onDeleteEvent,
  onCreateEvent,
  events = []
}) => {
  console.log('EventListViewComponent: Received events:', events.length);

  return (
    <EventListView
      events={events}
      onEditEvent={onEditEvent}
      onDeleteEvent={onDeleteEvent}
      onCreateEvent={onCreateEvent}
    />
  );
};
