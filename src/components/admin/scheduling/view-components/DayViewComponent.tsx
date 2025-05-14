
import React from 'react';
import DayView from '../DayView';
import { useCalendar } from '../context/CalendarContext';
import { processAvailabilities } from '../day-view/dayViewUtils';

interface DayViewComponentProps {
  showAvailability?: boolean;
}

export const DayViewComponent: React.FC<DayViewComponentProps> = ({
  showAvailability = true
}) => {
  const { currentDate, events, availabilities } = useCalendar();
  
  // Process availability data for the current day
  const availabilitySlots = showAvailability 
    ? processAvailabilities(currentDate, availabilities)
    : [];
  
  return (
    <DayView 
      events={events}
      availabilitySlots={availabilitySlots}
      onCreateEvent={undefined}
      onEditEvent={undefined}
      onDeleteEvent={undefined}
    />
  );
};
