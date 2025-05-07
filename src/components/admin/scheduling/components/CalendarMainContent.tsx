
import React, { useState } from 'react';
import CalendarHeader from '../CalendarHeader';
import CalendarSidebar from '../CalendarSidebar';
import EventListView from '../EventListView';
import CalendarViewRenderer from '../CalendarViewRenderer';
import { useCalendar } from '../context/CalendarContext';
import CalendarTitle from './CalendarTitle';
import { useEventHandlers } from './EventHandlers';
import ViewModeSelector, { ViewOption } from './ViewModeSelector';
import FilterSelector from './FilterSelector';

interface CalendarMainContentProps {
  hasAdminAccess?: boolean;
  title?: string;
  description?: string;
}

const CalendarMainContent: React.FC<CalendarMainContentProps> = ({
  hasAdminAccess = false,
  title,
  description
}) => {
  const [showEventList, setShowEventList] = useState(false);
  const { 
    currentDate, 
    viewMode, 
    setViewMode,
    isCreateEventOpen, 
    setIsCreateEventOpen
  } = useCalendar();
  
  const { 
    handleCreateEventClick, 
    handleEditEvent, 
    handleDeleteEvent, 
    handleDateClick 
  } = useEventHandlers();

  // State for selectors
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | null>(null);

  const viewOptions: ViewOption[] = [
    { value: 'day', label: 'Day View' },
    { value: 'week', label: 'Week View' },
    { value: 'month', label: 'Month View' },
  ];

  // Create the title element to pass to CalendarHeader
  const titleElement = title ? 
    <div>{title}</div> : 
    <CalendarTitle viewMode={viewMode} currentDate={currentDate} />;

  return (
    <div className="flex flex-col h-full">
      <CalendarHeader 
        title={titleElement}
        showEventListToggle={true}
        onToggleEventList={() => setShowEventList(!showEventList)}
        isEventListShown={showEventList}
        hasAdminAccess={hasAdminAccess}
        onCreateEvent={() => setIsCreateEventOpen(true)}
      />
      
      <div className="px-6 py-4">
        <div className="grid grid-cols-1 gap-4">
          {/* View and filter selectors */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-[150px]">
              <ViewModeSelector 
                viewMode={viewMode} 
                setViewMode={(mode) => setViewMode(mode as any)}
                viewOptions={viewOptions}
              />
            </div>
            <div className="flex-1">
              <FilterSelector 
                filterType={filterType}
                setFilterType={(type) => setFilterType(type as any)}
                selectedFilter={selectedFilter}
                setSelectedFilter={setSelectedFilter}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <div className="h-full">
          {showEventList ? (
            <EventListView 
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
            />
          ) : (
            <CalendarViewRenderer 
              viewMode={viewMode}
              showEventList={showEventList}
              onCreateEvent={() => setIsCreateEventOpen(true)}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
              onDateClick={handleDateClick}
              filterType={filterType}
              filterId={selectedFilter}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarMainContent;
