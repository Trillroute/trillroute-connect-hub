
import React, { useState } from 'react';
import { useCalendar } from '../context/CalendarContext';
import CalendarHeader from '../CalendarHeader';
import CalendarViewRenderer from '../CalendarViewRenderer';
import ViewModeSelector from './ViewModeSelector';
import FilterSelector from './FilterSelector';
import LayersDropdown from '../LayersDropdown';
import { useEventHandlers } from './EventHandlers';

interface CalendarMainContentProps {
  hasAdminAccess: boolean;
  title?: string;
  description?: string;
}

const CalendarMainContent: React.FC<CalendarMainContentProps> = ({
  hasAdminAccess,
  title = "Calendar",
  description,
}) => {
  const { viewMode } = useCalendar();
  const [filterType, setFilterType] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showEventList, setShowEventList] = useState(false);

  // Use the event handlers hook instead of the component
  const { handleCreateEvent, handleEditEvent, handleDeleteEvent, handleDateClick } = 
    useEventHandlers({ hasAdminAccess });

  return (
    <div className="flex flex-col h-full">
      <div className="border-b pb-4 px-4">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            {description && <p className="text-gray-500 text-sm mt-1">{description}</p>}
          </div>
          <div className="flex flex-col md:flex-row gap-2 md:items-center">
            <ViewModeSelector />
            <LayersDropdown />
          </div>
        </div>
        
        <div className="mt-4">
          <FilterSelector 
            filterType={filterType} 
            setFilterType={setFilterType}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
          />
        </div>

        <div className="mt-4">
          <CalendarHeader 
            title={title || "Calendar"}
            showEventListToggle={true}
            onToggleEventList={() => setShowEventList(!showEventList)}
            isEventListShown={showEventList}
            hasAdminAccess={hasAdminAccess}
            onCreateEvent={handleCreateEvent}
          />
        </div>
      </div>

      <div className="flex-grow overflow-y-auto">
        <CalendarViewRenderer
          viewMode={viewMode}
          showEventList={showEventList}
          onCreateEvent={handleCreateEvent}
          onEditEvent={handleEditEvent}
          onDeleteEvent={handleDeleteEvent}
          onDateClick={handleDateClick}
          filterType={filterType as any}
          filterId={selectedFilter}
          filterIds={selectedFilters}
        />
      </div>
    </div>
  );
};

export default CalendarMainContent;
