
import React from 'react';
import { useCalendar } from '../context/CalendarContext';
import FilterSelector from './FilterSelector';
import { CalendarEvent, CalendarViewMode } from '../context/calendarTypes';
import ViewModeSelector from './ViewModeSelector';
import { ViewSelector } from '../view-components/ViewSelector';

interface CalendarMainContentProps {
  filterType: string | null;
  setFilterType: (type: string | null) => void;
  selectedFilter: string | null;
  setSelectedFilter: (id: string | null) => void;
  selectedFilters: string[];
  setSelectedFilters: (ids: string[]) => void;
  onCreateEvent: () => void;
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (event: CalendarEvent) => void;
  onDateClick: (date: Date) => void;
}

const CalendarMainContent: React.FC<CalendarMainContentProps> = ({
  filterType,
  setFilterType,
  selectedFilter,
  setSelectedFilter,
  selectedFilters,
  setSelectedFilters,
  onCreateEvent,
  onEditEvent,
  onDeleteEvent,
  onDateClick
}) => {
  const { viewMode, setViewMode } = useCalendar();

  // Handler for view mode changes
  const handleViewModeChange = (mode: CalendarViewMode) => {
    console.log('Changing view mode to:', mode);
    setViewMode(mode);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top controls */}
      <div className="flex justify-between items-center mb-4 px-2 gap-3">
        <FilterSelector
          filterType={filterType}
          setFilterType={setFilterType}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
        />
        <ViewModeSelector
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
        />
      </div>

      {/* Calendar view content */}
      <div className="flex-1 overflow-hidden border rounded-md">
        <ViewSelector
          viewMode={viewMode}
          onCreateEvent={onCreateEvent}
          onEditEvent={onEditEvent}
          onDeleteEvent={onDeleteEvent}
          onDateClick={onDateClick}
        />
      </div>
    </div>
  );
};

export default CalendarMainContent;
