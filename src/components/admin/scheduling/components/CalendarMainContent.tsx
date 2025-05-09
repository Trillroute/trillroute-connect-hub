
import React, { useState } from 'react';
import CalendarHeader from '../CalendarHeader';
import CalendarViewRenderer from '../CalendarViewRenderer';
import EventFormDialog from '../EventFormDialog';
import FilterTypeTabs from './FilterTypeTabs';

const CalendarMainContent: React.FC = () => {
  const [isCreateEventDialogOpen, setIsCreateEventDialogOpen] = useState(false);

  const handleCreateEvent = () => {
    setIsCreateEventDialogOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      <CalendarHeader onCreateEvent={handleCreateEvent} />
      <FilterTypeTabs />
      <div className="flex-grow overflow-auto">
        <CalendarViewRenderer />
      </div>
      <EventFormDialog 
        isOpen={isCreateEventDialogOpen} 
        onClose={() => setIsCreateEventDialogOpen(false)} 
        mode="create" 
      />
    </div>
  );
};

export default CalendarMainContent;
