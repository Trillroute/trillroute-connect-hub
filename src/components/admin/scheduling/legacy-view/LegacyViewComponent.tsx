
import React, { useMemo } from 'react';
import { useFilteredEvents } from '../hooks/useFilteredEvents';
import { useCalendar } from '../context/CalendarContext';
import { Loader2 } from 'lucide-react';
import { getTimeSlots, getDaysOfWeek } from './legacyViewUtils';
import LegacyViewTable from './LegacyViewTable';

const LegacyViewComponent: React.FC = () => {
  // Directly use the calendar context for events and availabilities
  const { currentDate, events, availabilities } = useCalendar();
  
  // We'll still call useFilteredEvents to apply any filters, but we get data from context
  const { isLoading } = useFilteredEvents({
    filterType: null
  });
  
  // Get all time slots from events and availabilities
  const timeSlots = useMemo(() => 
    getTimeSlots(events, availabilities), 
    [events, availabilities]
  );
  
  // Get days of the week starting from current date
  const daysOfWeek = useMemo(() => 
    getDaysOfWeek(currentDate), 
    [currentDate]
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <LegacyViewTable
        events={events}
        availabilities={availabilities}
        timeSlots={timeSlots}
        daysOfWeek={daysOfWeek}
      />
    </div>
  );
};

export default LegacyViewComponent;
