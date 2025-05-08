import React, { useState } from 'react';
import { useCalendar } from '../context/CalendarContext';
import CalendarHeader from '../CalendarHeader';
import CalendarViewRenderer from '../CalendarViewRenderer';
import ViewModeSelector from './ViewModeSelector';
import FilterSelector from './FilterSelector';
import LayersDropdown from '../LayersDropdown';
import useEventHandlers from './EventHandlers';
import { CalendarViewMode } from '../context/calendarTypes';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
interface CalendarMainContentProps {
  hasAdminAccess: boolean;
  title?: string;
  description?: string;
  initialFilterType?: string | null;
}
const CalendarMainContent: React.FC<CalendarMainContentProps> = ({
  hasAdminAccess,
  title = "Calendar",
  description,
  initialFilterType = null
}) => {
  const {
    viewMode,
    setViewMode,
    currentDate,
    setIsCreateEventOpen
  } = useCalendar();
  const [filterType, setFilterType] = useState<string | null>(initialFilterType);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showEventList, setShowEventList] = useState(false);

  // Get event handlers from the hook
  const eventHandlers = useEventHandlers({
    hasAdminAccess,
    setIsCreateEventOpen
  });
  const viewOptions = [{
    value: 'day',
    label: 'Day'
  }, {
    value: 'week',
    label: 'Week'
  }, {
    value: 'month',
    label: 'Month'
  }];
  const handleFilterTypeChange = (type: string | null) => {
    setFilterType(type);
    setSelectedFilter(null);
    setSelectedFilters([]);
  };
  return <div className="flex flex-col h-full">
      <div className="border-b pb-4 px-4">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            {description && <p className="text-gray-500 text-sm mt-1">{description}</p>}
          </div>
          <div className="flex flex-col md:flex-row gap-2 md:items-center">
            <ViewModeSelector viewMode={viewMode as CalendarViewMode} setViewMode={mode => setViewMode(mode as CalendarViewMode)} viewOptions={viewOptions} />
            <div className="flex items-center">
              <button onClick={() => setShowEventList(!showEventList)} className={`px-3 py-1 text-sm border rounded-md ml-2 ${showEventList ? "bg-blue-600 text-white" : "bg-white"}`}>
                List View
              </button>
            </div>
            <LayersDropdown />
          </div>
        </div>
        
        <div className="mt-4">
          {/* Only show filter type tabs if this isn't a pre-filtered view */}
          {!initialFilterType && <Tabs defaultValue={filterType || "all"} onValueChange={value => handleFilterTypeChange(value === "all" ? null : value)}>
              
            </Tabs>}

          {/* Only show the multi-select when a filter type is selected */}
          {['course', 'skill', 'teacher', 'student', 'staff'].includes(filterType || '') && <div className="mt-2">
              <FilterSelector filterType={filterType} setFilterType={setFilterType} selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} showFilterTypeTabs={false} // Hide duplicate filter tabs
          />
            </div>}
        </div>

        <div className="mt-4">
          <CalendarHeader title={<div className="text-xl font-semibold">{filterType ? `${title} (${filterType})` : title}</div>} hasAdminAccess={hasAdminAccess} onCreateEvent={eventHandlers.handleCreateEvent} showEventListToggle={true} onToggleEventList={() => setShowEventList(!showEventList)} isEventListShown={showEventList} />
        </div>
      </div>

      <div className="flex-grow overflow-y-auto">
        <CalendarViewRenderer viewMode={viewMode as CalendarViewMode} showEventList={showEventList} onCreateEvent={eventHandlers.handleCreateEvent} onEditEvent={eventHandlers.handleEditEvent} onDeleteEvent={eventHandlers.handleDeleteEvent} onDateClick={eventHandlers.handleDateClick} filterType={filterType as any} filterId={selectedFilter} filterIds={selectedFilters} />
      </div>
    </div>;
};
export default CalendarMainContent;