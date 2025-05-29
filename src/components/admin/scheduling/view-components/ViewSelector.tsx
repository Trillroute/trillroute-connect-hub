
import React from 'react';
import { EventListViewComponent } from './EventListViewComponent';
import { WeekViewComponent } from './WeekViewComponent';
import { DayViewComponent } from './DayViewComponent';
import { MonthViewComponent } from './MonthViewComponent';
import { LegacyViewComponent } from './LegacyViewComponent';
import { CalendarEvent } from '../context/calendarTypes';
import { useCalendar } from '../context/CalendarContext';

interface ViewSelectorProps {
  currentView: string;
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (event: CalendarEvent) => void;
  onCreateEvent?: () => void;
  onDateClick: (date: Date) => void;
  showAvailability?: boolean;
  // Add filter props to pass through to views
  filterType?: 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | null;
  filterId?: string | null;
  filterIds?: string[];
  filters?: { users: string[]; courses: string[]; skills: string[] };
}

export const ViewSelector: React.FC<ViewSelectorProps> = ({
  currentView,
  onEditEvent,
  onDeleteEvent,
  onCreateEvent,
  onDateClick,
  showAvailability = true,
  filterType,
  filterId,
  filterIds,
  filters
}) => {
  // Get the filtered events and availabilities from the calendar context
  const { events, availabilities } = useCalendar();
  
  console.log('ViewSelector: Using filtered events from context:', events?.length || 0);
  console.log('ViewSelector: Filter props:', { filterType, filterId, filterIds, filters });

  const viewProps = {
    onEditEvent,
    onDeleteEvent,
    onCreateEvent,
    showAvailability,
    filterType,
    filterId,
    filterIds,
    filters,
    // Pass the filtered events and availabilities from context
    events,
    availabilities
  };

  switch (currentView) {
    case 'list':
      return <EventListViewComponent {...viewProps} />;
    case 'week':
      return <WeekViewComponent {...viewProps} />;
    case 'day':
      return <DayViewComponent {...viewProps} />;
    case 'month':
      return <MonthViewComponent {...viewProps} onDateClick={onDateClick} />;
    case 'legacy':
      return <LegacyViewComponent {...viewProps} />;
    default:
      return <WeekViewComponent {...viewProps} />;
  }
};
