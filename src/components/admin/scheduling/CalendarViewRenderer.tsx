
import React from 'react';
import DayView from './DayView';
import WeekView from './WeekView';
import MonthView from './MonthView';
import EventListView from './EventListView';
import { CalendarEvent } from './context/calendarTypes';
import { DayViewComponent } from './view-components/DayViewComponent';
import { WeekViewComponent } from './view-components/WeekViewComponent';
import { MonthViewComponent } from './view-components/MonthViewComponent';
import { EventListViewComponent } from './view-components/EventListViewComponent';
import { LegacyViewComponent } from './view-components/LegacyViewComponent';

interface CalendarViewRendererProps {
  viewMode: 'day' | 'week' | 'month' | 'list' | 'legacy';
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
  // Return appropriate calendar view based on viewMode
  switch (viewMode) {
    case 'day':
      return <DayViewComponent showAvailability={showAvailability} />;
    case 'week':
      return <WeekViewComponent showAvailability={showAvailability} />;
    case 'month':
      return <MonthViewComponent onDateClick={onDateClick} />;
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
      return <DayViewComponent showAvailability={showAvailability} />;
  }
};

export default CalendarViewRenderer;
