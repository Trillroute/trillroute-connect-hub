
import React from 'react';
import DayView from '../DayView';
import { useCalendar } from '../context/CalendarContext';
import { processAvailabilities } from '../day-view/dayViewUtils';
import { CalendarEvent } from '../context/calendarTypes';

interface DayViewComponentProps {
  showAvailability?: boolean;
}

export const DayViewComponent: React.FC<DayViewComponentProps> = ({
  showAvailability = true
}) => {
  const { 
    currentDate, 
    events, 
    availabilities,
    handleCreateEvent,
    handleUpdateEvent,
    handleDeleteEvent
  } = useCalendar();
  
  // Process availability data for the current day
  const availabilitySlots = showAvailability 
    ? processAvailabilities(currentDate, availabilities)
    : [];
  
  const handleCreateEventClick = () => {
    if (handleCreateEvent) {
      handleCreateEvent({});
    }
  };
  
  const handleEditEventClick = (event: CalendarEvent) => {
    if (handleUpdateEvent) {
      handleUpdateEvent(event.id, event);
    }
  };
  
  const handleDeleteEventClick = (event: CalendarEvent) => {
    if (handleDeleteEvent) {
      handleDeleteEvent(event.id);
    }
  };
  
  return (
    <DayView 
      availabilitySlots={availabilitySlots}
      onCreateEvent={handleCreateEventClick}
      onEditEvent={handleEditEventClick}
      onDeleteEvent={handleDeleteEventClick}
    />
  );
};
