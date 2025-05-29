
import React from 'react';
import DayView from '../DayView';
import { useCalendar } from '../context/CalendarContext';
import { processAvailabilities } from '../day-view/dayViewUtils';
import { CalendarEvent } from '../context/calendarTypes';

interface DayViewComponentProps {
  showAvailability?: boolean;
  onCreateEvent?: () => void;
  onEditEvent?: (event: CalendarEvent) => void;
  onDeleteEvent?: (event: CalendarEvent) => void;
}

export const DayViewComponent: React.FC<DayViewComponentProps> = ({
  showAvailability = true,
  onCreateEvent,
  onEditEvent,
  onDeleteEvent
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
    if (onCreateEvent) {
      onCreateEvent();
    } else if (handleCreateEvent) {
      const newEvent: Omit<CalendarEvent, 'id'> = {
        title: 'New Event',
        description: '',
        start: new Date(),
        end: new Date(Date.now() + 3600000), // 1 hour later
      };
      
      handleCreateEvent(newEvent);
    }
  };
  
  const handleEditEventClick = (event: CalendarEvent) => {
    if (onEditEvent) {
      onEditEvent(event);
    } else if (handleUpdateEvent) {
      handleUpdateEvent(event.id, event);
    }
  };
  
  const handleDeleteEventClick = (event: CalendarEvent) => {
    if (onDeleteEvent) {
      onDeleteEvent(event);
    } else if (handleDeleteEvent) {
      handleDeleteEvent(event.id);
    }
  };
  
  return (
    <DayView 
      onCreateEvent={handleCreateEventClick}
      onEditEvent={handleEditEventClick}
      onDeleteEvent={handleDeleteEventClick}
    />
  );
};
