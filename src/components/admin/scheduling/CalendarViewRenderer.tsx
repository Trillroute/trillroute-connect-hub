
import React from 'react';
import { CalendarEvent } from './context/calendarTypes';
import { FilteredEventsProvider } from './view-components/FilteredEventsProvider';
import { ViewSelector } from './view-components/ViewSelector';

interface CalendarViewRendererProps {
  viewMode: 'day' | 'week' | 'month';
  showEventList: boolean;
  onCreateEvent: () => void;
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (event: CalendarEvent) => void;
  onDateClick: (date: Date) => void;
  filterType?: 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | null;
  filterId?: string | null;
  filterIds?: string[];
}

const CalendarViewRenderer: React.FC<CalendarViewRendererProps> = ({
  viewMode,
  showEventList,
  onCreateEvent,
  onEditEvent,
  onDeleteEvent,
  onDateClick,
  filterType,
  filterId,
  filterIds = []
}) => {
  return (
    <FilteredEventsProvider filterType={filterType} filterId={filterId} filterIds={filterIds}>
      <ViewSelector 
        viewMode={viewMode}
        showEventList={showEventList}
        onCreateEvent={onCreateEvent}
        onEditEvent={onEditEvent}
        onDeleteEvent={onDeleteEvent}
        onDateClick={onDateClick}
      />
    </FilteredEventsProvider>
  );
};

export default CalendarViewRenderer;
