
import React from 'react';
import WeekView from '../WeekView';
import { CalendarEvent } from '../context/calendarTypes';

interface WeekViewComponentProps {
  onCreateEvent?: () => void;
  onEditEvent?: (event: CalendarEvent) => void;
  onDeleteEvent?: (event: CalendarEvent) => void;
}

export const WeekViewComponent: React.FC<WeekViewComponentProps> = ({
  onCreateEvent,
  onEditEvent,
  onDeleteEvent
}) => {
  return (
    <div className="h-full overflow-auto">
      <WeekView 
        onCreateEvent={onCreateEvent} 
        onEditEvent={onEditEvent}
        onDeleteEvent={onDeleteEvent}
      />
    </div>
  );
};
