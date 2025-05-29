
import React from 'react';
import { CalendarEvent } from '../context/calendarTypes';
import DayView from '../DayView';
import { useCalendar } from '../context/CalendarContext';

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
  // Get filtered events and availabilities from context
  const { events: contextEvents, availabilities: contextAvailabilities } = useCalendar();
  
  // Use context data (which is already filtered by FilteredEventsProvider)
  const finalEvents = contextEvents || events;
  const finalAvailabilities = contextAvailabilities || availabilities;
  
  console.log('DayViewComponent: Using events from context:', finalEvents.length);

  return (
    <DayView
      events={finalEvents}
      availabilities={finalAvailabilities}
      onEditEvent={onEditEvent}
      onDeleteEvent={onDeleteEvent}
      onCreateEvent={onCreateEvent}
      showAvailability={showAvailability}
    />
  );
};
