
import React from 'react';
import { DayViewComponent } from './view-components/DayViewComponent';
import { WeekViewComponent } from './view-components/WeekViewComponent';
import { MonthViewComponent } from './view-components/MonthViewComponent';
import { EventListViewComponent } from './view-components/EventListViewComponent';
import { LegacyViewComponent } from './view-components/LegacyViewComponent';
import { CalendarEvent } from './types';

interface CalendarViewRendererProps {
  viewMode: 'day' | 'week' | 'month' | 'list' | 'legacy';
  onDateClick?: (date: Date) => void;
  onCreateEvent?: () => void;
  onEditEvent?: (event: CalendarEvent) => void;
  onDeleteEvent?: (event: CalendarEvent) => void;
}

const CalendarViewRenderer: React.FC<CalendarViewRendererProps> = ({
  viewMode,
  onDateClick,
  onCreateEvent,
  onEditEvent,
  onDeleteEvent
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
