
import React from 'react';
import { CalendarEvent } from '../context/calendarTypes';
import MonthView from '../MonthView';
import { useCalendar } from '../context/CalendarContext';

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
  // Get filtered events from context
  const { events: contextEvents } = useCalendar();
  
  // Use context data (which is already filtered by FilteredEventsProvider)
  const finalEvents = contextEvents || events;
  
  console.log('MonthViewComponent: Using events from context:', finalEvents.length);

  return (
    <MonthView
      events={finalEvents}
      onDateClick={onDateClick}
      onCreateEvent={onCreateEvent}
      onEditEvent={onEditEvent}
      onDeleteEvent={onDeleteEvent}
    />
  );
};
