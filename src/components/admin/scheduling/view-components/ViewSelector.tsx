
import React from 'react';
import { DayViewComponent } from './DayViewComponent';
import { WeekViewComponent } from './WeekViewComponent';
import { MonthViewComponent } from './MonthViewComponent';
import { EventListViewComponent } from './EventListViewComponent';
import { CalendarEvent } from '../context/calendarTypes';

interface ViewSelectorProps {
  viewMode: 'day' | 'week' | 'month' | 'list';
  onCreateEvent: () => void;
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (event: CalendarEvent) => void;
  onDateClick: (date: Date) => void;
  showFilterTabs?: boolean; // Not used anymore - we're removing the duplicate tabs
}

export const ViewSelector: React.FC<ViewSelectorProps> = ({ 
  viewMode, 
  onCreateEvent, 
  onEditEvent, 
  onDeleteEvent,
  onDateClick
}) => {
  // Common props to pass to all view components
  const viewProps = {
    onCreateEvent,
    onEditEvent,
    onDeleteEvent,
    onDateClick
  };

  // Render appropriate view based on viewMode
  switch (viewMode) {
    case 'day':
      return <DayViewComponent {...viewProps} />;
    case 'week':
      return <WeekViewComponent {...viewProps} />;
    case 'month':
      return <MonthViewComponent {...viewProps} />;
    case 'list':
      return <EventListViewComponent {...viewProps} />;
    default:
      return <WeekViewComponent {...viewProps} />;
  }
};
