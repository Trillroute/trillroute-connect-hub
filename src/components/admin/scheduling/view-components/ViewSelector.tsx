import React from 'react';
import { CalendarEvent } from '../context/calendarTypes';
import { useAuth } from '@/hooks/useAuth';
import { DayViewComponent } from './DayViewComponent';
import { WeekViewComponent } from './WeekViewComponent';
import { MonthViewComponent } from './MonthViewComponent';
import { EventListViewComponent } from './EventListViewComponent';

interface ViewSelectorProps {
  viewMode: 'day' | 'week' | 'month';
  showEventList: boolean;
  onCreateEvent: () => void;
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (event: CalendarEvent) => void;
  onDateClick: (date: Date) => void;
}

export const ViewSelector: React.FC<ViewSelectorProps> = ({
  viewMode,
  showEventList,
  onCreateEvent,
  onEditEvent,
  onDeleteEvent,
  onDateClick,
}) => {
  const { role } = useAuth();
  const isAdminOrHigher = role === 'admin' || role === 'superadmin';
  
  // Always show the event list if showEventList is true, regardless of view mode
  if (showEventList) {
    return (
      <EventListViewComponent 
        onEditEvent={onEditEvent}
        onDeleteEvent={onDeleteEvent}
      />
    );
  }
  
  // Otherwise, show the regular calendar view based on viewMode
  switch (viewMode) {
    case 'week':
      return (
        <WeekViewComponent 
          onCreateEvent={isAdminOrHigher ? onCreateEvent : undefined}
        />
      );
    case 'day':
      return (
        <DayViewComponent 
          onCreateEvent={isAdminOrHigher ? onCreateEvent : undefined}
          onEditEvent={isAdminOrHigher ? onEditEvent : undefined}
          onDeleteEvent={isAdminOrHigher ? onDeleteEvent : undefined}
        />
      );
    case 'month':
      return (
        <MonthViewComponent onDateClick={onDateClick} />
      );
    default:
      return null;
  }
};
