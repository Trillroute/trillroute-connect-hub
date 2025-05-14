
import React from 'react';
import { DayViewComponent } from './view-components/DayViewComponent';
import { WeekViewComponent } from './view-components/WeekViewComponent';
import { MonthViewComponent } from './view-components/MonthViewComponent';
import { EventListViewComponent } from './view-components/EventListViewComponent';
import { LegacyViewComponent } from './view-components/LegacyViewComponent';
import { CalendarEvent, CalendarViewMode } from './types';
import { ScrollArea } from '@/components/ui/scroll-area';

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
      return (
        <ScrollArea className="h-full">
          <DayViewComponent onCreateEvent={onCreateEvent} />
        </ScrollArea>
      );
    case 'week':
      return (
        <ScrollArea className="h-full">
          <WeekViewComponent onCreateEvent={onCreateEvent} />
        </ScrollArea>
      );
    case 'month':
      return (
        <ScrollArea className="h-full">
          <MonthViewComponent onDateClick={onDateClick || (() => {})} />
        </ScrollArea>
      );
    case 'legacy':
      return (
        <ScrollArea className="h-full">
          <LegacyViewComponent 
            onCreateEvent={onCreateEvent} 
            onEditEvent={onEditEvent} 
            onDeleteEvent={onDeleteEvent} 
          />
        </ScrollArea>
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
