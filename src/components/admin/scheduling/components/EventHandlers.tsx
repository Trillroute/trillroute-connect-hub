
import React from 'react';
import { useCalendar } from '../context/CalendarContext';
import { CalendarEvent } from '../context/calendarTypes';

// Define the returned handlers interface for better type safety
export interface EventHandlerFunctions {
  handleCreateEvent: () => void;
  handleEditEvent: (event: CalendarEvent) => void;
  handleDeleteEvent: (event: CalendarEvent) => void;
  handleDateClick: (date: Date) => void;
}

interface EventHandlersProps {
  hasAdminAccess: boolean;
}

export const useEventHandlers = ({ hasAdminAccess }: EventHandlersProps): EventHandlerFunctions => {
  const { setIsCreateEventOpen } = useCalendar();
  
  const handleCreateEvent = () => {
    if (hasAdminAccess) {
      setIsCreateEventOpen(true);
    }
  };

  const handleEditEvent = (event: CalendarEvent) => {
    console.log('Edit event:', event);
  };

  const handleDeleteEvent = (event: CalendarEvent) => {
    console.log('Delete event:', event);
  };

  const handleDateClick = (date: Date) => {
    console.log('Date clicked:', date);
  };

  return {
    handleCreateEvent,
    handleEditEvent,
    handleDeleteEvent,
    handleDateClick
  };
};

// This is a stub component that doesn't render anything
// It's here for compatibility but we're using the hook instead
const EventHandlers: React.FC = () => null;

export default EventHandlers;
