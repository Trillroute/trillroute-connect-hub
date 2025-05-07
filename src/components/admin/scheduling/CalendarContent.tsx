
import React from 'react';
import CalendarMainContent from './components/CalendarMainContent';
import CreateEventDialog from './CreateEventDialog';
import { useCalendar } from './context/CalendarContext';
import { useEventFilters } from './hooks/useEventFilters';

interface CalendarContentProps {
  hasAdminAccess?: boolean;
  userId?: string;
  userIds?: string[];
  roleFilter?: string[];
  courseId?: string;
  skillId?: string;
  title?: string;
  description?: string;
}

const CalendarContent: React.FC<CalendarContentProps> = ({ 
  hasAdminAccess = false,
  userId,
  userIds,
  roleFilter,
  courseId,
  skillId,
  title,
  description
}) => {
  const { 
    currentDate,
    isCreateEventOpen, 
    setIsCreateEventOpen, 
    handleCreateEvent
  } = useCalendar();

  // Use the custom hook to handle event filtering
  useEventFilters({
    userId,
    userIds,
    roleFilter,
    courseId,
    skillId
  });

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
      <CalendarMainContent 
        hasAdminAccess={hasAdminAccess}
        title={title}
        description={description}
      />
      
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
