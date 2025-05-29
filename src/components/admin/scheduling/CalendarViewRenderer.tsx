
import React from 'react';
import DayView from './DayView';
import WeekView from './WeekView';
import EventListView from './EventListView';
import { CalendarEvent } from './context/calendarTypes';
import { DayViewComponent } from './view-components/DayViewComponent';
import { WeekViewComponent } from './view-components/WeekViewComponent';
import { EventListViewComponent } from './view-components/EventListViewComponent';
import { LegacyViewComponent } from './view-components/LegacyViewComponent';
import { useCalendar } from './context/CalendarContext';

interface CalendarViewRendererProps {
  viewMode: 'day' | 'week' | 'list' | 'legacy';
  onCreateEvent: () => void;
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (event: CalendarEvent) => void;
  onDateClick: () => void;
  filterType?: 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | null;
  filterIds?: string[];
  showAvailability?: boolean;
}

const CalendarViewRenderer: React.FC<CalendarViewRendererProps> = ({
  viewMode,
  onCreateEvent,
  onEditEvent,
  onDeleteEvent,
  onDateClick,
  filterType,
  filterIds,
  showAvailability = true
}) => {
  const { events } = useCalendar();
  
  console.log(`CalendarViewRenderer: Rendering ${viewMode} view with ${events.length} filtered events`);
  console.log('CalendarViewRenderer: Filter state:', { filterType, filterIds });
  
  // Return appropriate calendar view based on viewMode
  // All views will use the filtered events from the CalendarContext
  switch (viewMode) {
    case 'day':
      return (
        <DayViewComponent 
          showAvailability={showAvailability}
          onCreateEvent={onCreateEvent}
          onEditEvent={onEditEvent}
          onDeleteEvent={onDeleteEvent}
        />
      );
    case 'week':
      return (
        <WeekViewComponent 
          showAvailability={showAvailability}
          onCreateEvent={onCreateEvent}
          onEditEvent={onEditEvent}
          onDeleteEvent={onDeleteEvent}
        />
      );
    case 'list':
      return (
        <EventListViewComponent 
          onEditEvent={onEditEvent} 
          onDeleteEvent={onDeleteEvent}
          showAvailability={showAvailability}
        />
      );
    case 'legacy':
      return (
        <LegacyViewComponent
          onCreateEvent={onCreateEvent}
          onEditEvent={onEditEvent}
          onDeleteEvent={onDeleteEvent}
        />
      );
    default:
      return (
        <DayViewComponent 
          showAvailability={showAvailability}
          onCreateEvent={onCreateEvent}
          onEditEvent={onEditEvent}
          onDeleteEvent={onDeleteEvent}
        />
      );
  }
};

export default CalendarViewRenderer;
