
import React, { useState } from 'react';
import CalendarHeader from '../CalendarHeader';
import CalendarViewRenderer from '../CalendarViewRenderer';
import EventFormDialog from '../EventFormDialog';
import FilterTypeTabs from './FilterTypeTabs';
import { useCalendar } from '../context/CalendarContext';

const CalendarMainContent: React.FC = () => {
  const [isCreateEventDialogOpen, setIsCreateEventDialogOpen] = useState(false);
  const { filterType, setFilterType } = useCalendar();

  const handleCreateEvent = () => {
    setIsCreateEventDialogOpen(true);
  };

  const handleEventEdit = () => {
    // Implement event edit logic here
  };

  const handleEventDelete = () => {
    // Implement event delete logic here
  };

  const handleDateClick = () => {
    // Implement date click logic here
  };

  return (
    <div className="flex flex-col h-full">
      <CalendarHeader onCreateEvent={handleCreateEvent} />
      <FilterTypeTabs filterType={filterType} setFilterType={setFilterType} />
      <div className="flex-grow overflow-auto">
        <CalendarViewRenderer 
          viewMode="week" 
          onCreateEvent={handleCreateEvent}
          onEditEvent={handleEventEdit}
          onDeleteEvent={handleEventDelete}
          onDateClick={handleDateClick}
        />
      </div>
      <EventFormDialog 
        open={isCreateEventDialogOpen} 
        onOpenChange={setIsCreateEventDialogOpen} 
        mode="create" 
      />
    </div>
  );
};

export default CalendarMainContent;
