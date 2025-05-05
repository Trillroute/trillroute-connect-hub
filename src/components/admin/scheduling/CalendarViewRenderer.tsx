import React from 'react';
import { CalendarViewMode, CalendarEvent } from './types';
import WeekView from './WeekView';
import DayView from './DayView';
import MonthView from './MonthView';
import EventListView from './EventListView';

interface CalendarViewRendererProps {
  viewMode: CalendarViewMode;
  showEventList: boolean;
  onCreateEvent: () => void;
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (event: CalendarEvent) => void;
  onDateClick: (date: Date) => void;
}

const CalendarViewRenderer: React.FC<CalendarViewRendererProps> = ({
  viewMode,
  showEventList,
  onCreateEvent,
  onEditEvent,
  onDeleteEvent,
  onDateClick
}) => {
  // Always show the event list if showEventList is true, regardless of view mode
  if (showEventList) {
    return (
      <EventListView 
        onEditEvent={onEditEvent}
        onDeleteEvent={onDeleteEvent}
      />
    );
  }
  
  // Otherwise, show the regular calendar view based on viewMode
  switch (viewMode) {
    case 'week':
      return (
        <WeekView onCreateEvent={onCreateEvent} />
      );
    case 'day':
      return (
        <DayView 
          onCreateEvent={onCreateEvent}
          onEditEvent={onEditEvent}
          onDeleteEvent={onDeleteEvent}
        />
      );
    case 'month':
      return (
        <MonthView onDateClick={onDateClick} />
      );
    default:
      return null;
  }
};

export default CalendarViewRenderer;
