
import React, { useState } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarSidebar from './CalendarSidebar';
import EventListView from './EventListView';
import CalendarViewRenderer from './CalendarViewRenderer';
import CreateEventDialog from './CreateEventDialog';
import { useCalendar } from './CalendarContext';

interface CalendarContentProps {
  hasAdminAccess?: boolean;
}

const CalendarContent: React.FC<CalendarContentProps> = ({ 
  hasAdminAccess = false 
}) => {
  const [showEventList, setShowEventList] = useState(false);
  const { currentDate, viewMode, isCreateEventOpen, setIsCreateEventOpen, handleCreateEvent } = useCalendar();

  // Format title based on view mode and current date
  let title;
  const options = { month: 'long' as const, year: 'numeric' as const };
  
  switch (viewMode) {
    case 'day':
      title = currentDate.toLocaleDateString('en-US', {
        ...options,
        day: 'numeric' as const,
      });
      break;
    case 'week':
      title = `Week of ${currentDate.toLocaleDateString('en-US', {
        month: 'short' as const,
        day: 'numeric' as const,
      })}`;
      break;
    default:
      title = currentDate.toLocaleDateString('en-US', options);
  }

  // Handle event operations
  const handleCreateEventClick = () => {
    setIsCreateEventOpen(true);
  };

  const handleEditEvent = (event) => {
    console.log('Edit event:', event);
    // Will be implemented in a future feature
  };

  const handleDeleteEvent = (event) => {
    console.log('Delete event:', event);
    // Will be implemented in a future feature
  };

  const handleDateClick = (date) => {
    console.log('Date clicked:', date);
    // Will be implemented in a future feature
  };

  // Handle dialog close
  const handleCloseCreateDialog = () => {
    setIsCreateEventOpen(false);
  };

  // Handle save event
  const handleSaveEvent = (eventData) => {
    handleCreateEvent(eventData);
    setIsCreateEventOpen(false);
  };

  return (
    <div className="flex flex-col h-full">
      <CalendarHeader 
        title={title}
        showEventListToggle={true}
        onToggleEventList={() => setShowEventList(!showEventList)}
        isEventListShown={showEventList}
        hasAdminAccess={hasAdminAccess}
      />
      
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
              onCreateEvent={handleCreateEventClick}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
              onDateClick={handleDateClick}
            />
          )}
        </div>
      </div>
      
      {isCreateEventOpen && (
        <CreateEventDialog
          open={isCreateEventOpen}
          onOpenChange={handleCloseCreateDialog}
          onSave={handleSaveEvent}
          startDate={currentDate}
        />
      )}
    </div>
  );
};

export default CalendarContent;
