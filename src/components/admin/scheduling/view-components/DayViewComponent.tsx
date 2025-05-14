
import React from 'react';
import DayView from '../DayView';
import { useCalendar } from '../context/CalendarContext';
import { processAvailabilities } from '../day-view/dayViewUtils';

interface DayViewComponentProps {
  showAvailability?: boolean;
  allowEventCreation?: boolean;
}

export const DayViewComponent: React.FC<DayViewComponentProps> = ({
  showAvailability = true,
  allowEventCreation = true
}) => {
  const { currentDate, events, availabilities } = useCalendar();
  
  // Process availability data for the current day
  const availabilitySlots = showAvailability 
    ? processAvailabilities(currentDate, availabilities)
    : [];
  
  return (
    <div className="h-full overflow-auto">
      <DayView 
        onCreateEvent={() => {}}
        availabilitySlots={availabilitySlots}
        allowEventCreation={allowEventCreation}
      />
    </div>
  );
};
