
import React from 'react';
import { CalendarEvent } from '../context/calendarTypes';
import WeekView from '../WeekView';

interface WeekViewComponentProps {
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (event: CalendarEvent) => void;
  onCreateEvent?: () => void;
  showAvailability?: boolean;
  filterType?: 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | null;
  filterId?: string | null;
  filterIds?: string[];
  filters?: { users: string[]; courses: string[]; skills: string[] };
  // Accept the filtered events and availabilities from ViewSelector
  events?: CalendarEvent[];
  availabilities?: any;
}

export const WeekViewComponent: React.FC<WeekViewComponentProps> = ({
  onEditEvent,
  onDeleteEvent,
  onCreateEvent,
  showAvailability = true,
  events = [],
  availabilities = {}
}) => {
  console.log('WeekViewComponent: Received events:', events.length);
  console.log('WeekViewComponent: Received availabilities:', Object.keys(availabilities).length);

  return (
    <WeekView
      events={events}
      availabilities={availabilities}
      onEditEvent={onEditEvent}
      onDeleteEvent={onDeleteEvent}
      onCreateEvent={onCreateEvent}
      showAvailability={showAvailability}
    />
  );
};
