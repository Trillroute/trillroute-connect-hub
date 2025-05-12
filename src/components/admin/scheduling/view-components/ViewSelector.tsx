
import React from 'react';
import { CalendarEvent } from '../context/calendarTypes';
import { useAuth } from '@/hooks/useAuth';
import { DayViewComponent } from './DayViewComponent';
import { WeekViewComponent } from './WeekViewComponent';
import { MonthViewComponent } from './MonthViewComponent';
import { EventListViewComponent } from './EventListViewComponent';
import LegacyViewComponent from '../legacy-view/LegacyViewComponent';

interface ViewSelectorProps {
  viewMode: 'day' | 'week' | 'month' | 'list' | 'legacy';
  onCreateEvent: () => void;
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (event: CalendarEvent) => void;
  onDateClick: (date: Date) => void;
}

export const ViewSelector: React.FC<ViewSelectorProps> = ({
  viewMode,
  onCreateEvent,
  onEditEvent,
  onDeleteEvent,
  onDateClick,
}) => {
  const { role } = useAuth();
  const isAdminOrHigher = role === 'admin' || role === 'superadmin';
  
  console.log('ViewSelector rendering with viewMode:', viewMode);
  
  // Show the appropriate view based on viewMode
  switch (viewMode) {
    case 'day':
      return (
        <DayViewComponent 
          onCreateEvent={isAdminOrHigher ? onCreateEvent : undefined}
          onEditEvent={isAdminOrHigher ? onEditEvent : undefined}
          onDeleteEvent={isAdminOrHigher ? onDeleteEvent : undefined}
        />
      );
    case 'week':
      return (
        <WeekViewComponent 
          onCreateEvent={isAdminOrHigher ? onCreateEvent : undefined}
        />
      );
    case 'month':
      return (
        <MonthViewComponent onDateClick={onDateClick} />
      );
    case 'list':
      console.log('Rendering list view component');
      return (
        <EventListViewComponent 
          onEditEvent={isAdminOrHigher ? onEditEvent : undefined}
          onDeleteEvent={isAdminOrHigher ? onDeleteEvent : undefined}
        />
      );
    case 'legacy':
      console.log('Rendering legacy view component');
      return (
        <LegacyViewComponent />
      );
    default:
      console.error(`Unknown view mode: ${viewMode}`);
      // Fallback to week view
      return (
        <WeekViewComponent 
          onCreateEvent={isAdminOrHigher ? onCreateEvent : undefined}
        />
      );
  }
};
