
import React, { useEffect } from 'react';
import { CalendarEvent, CalendarViewMode } from './context/calendarTypes';
import { FilteredEventsProvider } from './view-components/FilteredEventsProvider';
import { ViewSelector } from './view-components/ViewSelector';
import { useCalendar } from './context/CalendarContext';

interface CalendarViewRendererProps {
  viewMode: CalendarViewMode;
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
  onCreateEvent,
  onEditEvent,
  onDeleteEvent,
  onDateClick,
  filterType = null,
  filterId = null,
  filterIds = []
}) => {
  const { setViewMode } = useCalendar();
  
  // Ensure the CalendarContext's viewMode stays in sync with the prop
  useEffect(() => {
    console.log('CalendarViewRenderer: Setting view mode to:', viewMode);
    setViewMode(viewMode);
  }, [viewMode, setViewMode]);

  // Log current filter settings
  useEffect(() => {
    console.log('CalendarViewRenderer applying filters:', {
      filterType,
      filterId,
      filterIds,
      viewMode
    });
  }, [filterType, filterId, filterIds, viewMode]);

  return (
    <FilteredEventsProvider 
      filterType={filterType} 
      filterId={filterId} 
      filterIds={filterIds}
    >
      <ViewSelector 
        viewMode={viewMode}
        onCreateEvent={onCreateEvent}
        onEditEvent={onEditEvent}
        onDeleteEvent={onDeleteEvent}
        onDateClick={onDateClick}
      />
    </FilteredEventsProvider>
  );
};

export default CalendarViewRenderer;
