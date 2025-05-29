
import React from 'react';
import { CalendarEvent } from '../context/calendarTypes';
import MonthView from '../MonthView';

interface MonthViewComponentProps {
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (event: CalendarEvent) => void;
  onCreateEvent?: () => void;
  onDateClick: (date: Date) => void;
  showAvailability?: boolean;
  filterType?: 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | null;
  filterId?: string | null;
  filterIds?: string[];
  filters?: { users: string[]; courses: string[]; skills: string[] };
  // Accept the filtered events from ViewSelector
  events?: CalendarEvent[];
  availabilities?: any;
}

export const MonthViewComponent: React.FC<MonthViewComponentProps> = ({
  onEditEvent,
  onDeleteEvent,
  onCreateEvent,
  onDateClick,
  events = []
}) => {
  console.log('MonthViewComponent: Received events:', events.length);

  return (
    <MonthView
      events={events}
      onEditEvent={onEditEvent}
      onDeleteEvent={onDeleteEvent}
      onCreateEvent={onCreateEvent}
      onDateClick={onDateClick}
    />
  );
};
