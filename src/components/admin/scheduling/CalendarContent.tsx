
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
  const { currentDate, viewMode, isCreateEventOpen, setIsCreateEventOpen } = useCalendar();

  // Format title based on view mode and current date
  let title;
  const options = { month: 'long', year: 'numeric' };
  
  switch (viewMode) {
    case 'day':
      title = currentDate.toLocaleDateString('en-US', {
        ...options,
        day: 'numeric',
      });
      break;
    case 'week':
      title = `Week of ${currentDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })}`;
      break;
    default:
      title = currentDate.toLocaleDateString('en-US', options);
  }

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
            <EventListView />
          ) : (
            <CalendarViewRenderer />
          )}
        </div>
      </div>
      
      {isCreateEventOpen && (
        <CreateEventDialog
          isOpen={isCreateEventOpen}
          onClose={() => setIsCreateEventOpen(false)}
        />
      )}
    </div>
  );
};

export default CalendarContent;
