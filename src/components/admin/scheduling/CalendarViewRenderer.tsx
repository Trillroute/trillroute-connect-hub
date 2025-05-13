
import React from 'react';
import { DayViewComponent } from './view-components/DayViewComponent';
import { WeekViewComponent } from './view-components/WeekViewComponent';
import { MonthViewComponent } from './view-components/MonthViewComponent';
import { EventListViewComponent } from './view-components/EventListViewComponent';
import { LegacyViewComponent } from './view-components/LegacyViewComponent';
import { CalendarEvent, CalendarViewMode } from './types';

interface CalendarViewRendererProps {
  viewMode: CalendarViewMode;
  onDateClick?: (date: Date) => void;
  onCreateEvent?: () => void;
  onEditEvent?: (event: CalendarEvent) => void;
  onDeleteEvent?: (event: CalendarEvent) => void;
  filterType?: 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | null;
  filterIds?: string[];
}

const CalendarViewRenderer: React.FC<CalendarViewRendererProps> = ({
  viewMode,
  onDateClick,
  onCreateEvent,
  onEditEvent,
  onDeleteEvent,
  filterType,
  filterIds
}) => {
  switch (viewMode) {
    case 'day':
      return <DayViewComponent onCreateEvent={onCreateEvent} />;
    case 'week':
      return <WeekViewComponent onCreateEvent={onCreateEvent} />;
    case 'month':
      return <MonthViewComponent onDateClick={onDateClick || (() => {})} />;
    case 'legacy':
      return (
        <LegacyViewComponent 
          onCreateEvent={onCreateEvent} 
          onEditEvent={onEditEvent} 
          onDeleteEvent={onDeleteEvent} 
        />
      );
    case 'list':
    default:
      return (
        <EventListViewComponent 
          onEditEvent={onEditEvent || (() => {})} 
          onDeleteEvent={onDeleteEvent || (() => {})} 
        />
      );
  }
};

export default CalendarViewRenderer;
