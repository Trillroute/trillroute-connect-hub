
import React from 'react';
import DayView from '../DayView';
import { CalendarEvent } from '../context/calendarTypes';

interface DayViewComponentProps {
  onCreateEvent?: () => void;
  onEditEvent?: (event: CalendarEvent) => void;
  onDeleteEvent?: (event: CalendarEvent) => void;
}

export const DayViewComponent: React.FC<DayViewComponentProps> = ({
  onCreateEvent,
  onEditEvent,
  onDeleteEvent
}) => {
  return (
    <div className="h-full overflow-auto">
      <DayView 
        onCreateEvent={onCreateEvent}
        onEditEvent={onEditEvent}
        onDeleteEvent={onDeleteEvent}
      />
    </div>
  );
};
