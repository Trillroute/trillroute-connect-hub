
import React from 'react';
import { CalendarEvent } from '../context/calendarTypes';
import { useCalendar } from '../context/CalendarContext';

interface EventHandlersProps {
  hasAdminAccess: boolean;
  setIsCreateEventOpen: (isOpen: boolean) => void;
}

// The key is to change this from a React component to a custom hook
const useEventHandlers = ({
  hasAdminAccess,
  setIsCreateEventOpen,
}: EventHandlersProps) => {
  const { handleCreateEvent, handleUpdateEvent, handleDeleteEvent } = useCalendar();
  
  // Create wrapper functions that include permission checks
  const handleCreateEventWithCheck = () => {
    if (hasAdminAccess) {
      setIsCreateEventOpen(true);
    } else {
      console.log('No permission to create events');
    }
  };

  const handleEditEventWithCheck = (event: CalendarEvent) => {
    if (hasAdminAccess) {
      console.log('Edit event:', event);
      // The editing logic will be implemented in the dialog
    } else {
      console.log('No permission to edit events');
    }
  };

  const handleDeleteEventWithCheck = (event: CalendarEvent) => {
    if (hasAdminAccess) {
      console.log('Delete event:', event);
      if (event.id) {
        handleDeleteEvent(event.id);
      }
    } else {
      console.log('No permission to delete events');
    }
  };

  const handleDateClick = (date: Date) => {
    console.log('Date clicked:', date);
    if (hasAdminAccess) {
      setIsCreateEventOpen(true);
    }
  };

  // Return the handlers as a hook result
  return {
    handleCreateEvent: handleCreateEventWithCheck,
    handleEditEvent: handleEditEventWithCheck,
    handleDeleteEvent: handleDeleteEventWithCheck,
    handleDateClick
  };
};

export default useEventHandlers;
