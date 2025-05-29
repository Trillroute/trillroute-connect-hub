
import React from 'react';
import { CalendarEvent } from '../context/calendarTypes';
import { DayView } from '../DayView';

interface DayViewComponentProps {
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

export const DayViewComponent: React.FC<DayViewComponentProps> = ({
  onEditEvent,
  onDeleteEvent,
  onCreateEvent,
  showAvailability = true,
  events = [],
  availabilities = {}
}) => {
  console.log('DayViewComponent: Received events:', events.length);

  return (
    <DayView
      events={events}
      availabilities={availabilities}
      onEditEvent={onEditEvent}
      onDeleteEvent={onDeleteEvent}
      onCreateEvent={onCreateEvent}
      showAvailability={showAvailability}
    />
  );
};
