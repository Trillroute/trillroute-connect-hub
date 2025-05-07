
import React, { useState } from 'react';
import CalendarHeader from '../CalendarHeader';
import CalendarSidebar from '../CalendarSidebar';
import EventListView from '../EventListView';
import CalendarViewRenderer from '../CalendarViewRenderer';
import { useCalendar } from '../context/CalendarContext';
import CalendarTitle from './CalendarTitle';
import { useEventHandlers } from './EventHandlers';

interface CalendarMainContentProps {
  hasAdminAccess?: boolean;
}

const CalendarMainContent: React.FC<CalendarMainContentProps> = ({
  hasAdminAccess = false
}) => {
  const [showEventList, setShowEventList] = useState(false);
  const { 
    currentDate, 
    viewMode, 
    isCreateEventOpen, 
    setIsCreateEventOpen
  } = useCalendar();
  
  const { 
    handleCreateEventClick, 
    handleEditEvent, 
    handleDeleteEvent, 
    handleDateClick 
  } = useEventHandlers();

  return (
    <div className="flex flex-col h-full">
      <CalendarHeader 
        title={<CalendarTitle viewMode={viewMode} currentDate={currentDate} />}
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
              onCreateEvent={() => setIsCreateEventOpen(true)}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
              onDateClick={handleDateClick}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarMainContent;
