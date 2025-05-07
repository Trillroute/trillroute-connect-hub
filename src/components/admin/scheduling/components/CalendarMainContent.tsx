
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
  const [filterType, setFilterType] = useState<'course' | 'skill' | 'teacher' | 'student' | null>(null);

  const viewOptions: ViewOption[] = [
    { value: 'month', label: 'Month View' },
    { value: 'week', label: 'Week View' },
    { value: 'day', label: 'Day View' },
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
      />
      
      <div className="flex flex-wrap gap-2 px-4 py-2 border-b items-center">
        <ViewModeSelector 
          viewMode={viewMode} 
          setViewMode={(mode) => setViewMode(mode as any)}
          viewOptions={viewOptions}
        />

        <FilterSelector 
          filterType={filterType}
          setFilterType={(type) => setFilterType(type as any)}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
        />
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        <CalendarSidebar />
        
        <div className="flex-1 overflow-auto">
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
