
import React, { useMemo, useEffect } from 'react';
import { useCalendar } from '../context/CalendarContext';
import { Loader2 } from 'lucide-react';
import { getTimeSlots, getDaysOfWeek } from './legacyViewUtils';
import LegacyViewTable from './LegacyViewTable';
import { useStaffAvailability } from '@/hooks/useStaffAvailability';

const LegacyViewComponent: React.FC = () => {
  // Directly use the calendar context for events
  const { currentDate, events, refreshEvents } = useCalendar();
  const { availabilityByUser, loading: availabilityLoading, refetch: refreshAvailability } = useStaffAvailability();
  
  // Ensure we have the latest events and availability data
  useEffect(() => {
    console.log("Legacy view mounted, refreshing data...");
    const loadData = async () => {
      await refreshEvents();
      await refreshAvailability();
      console.log("Legacy view data refreshed");
    };
    
    loadData();
  }, [refreshEvents, refreshAvailability]);
  
  // Get all time slots from events and availabilities
  const timeSlots = useMemo(() => 
    getTimeSlots(events, availabilityByUser), 
    [events, availabilityByUser]
  );
  
  // Get days of the week starting from current date
  const daysOfWeek = useMemo(() => 
    getDaysOfWeek(currentDate), 
    [currentDate]
  );

  // Log data for debugging
  useEffect(() => {
    console.log("Legacy view data:", {
      events: events.length,
      timeSlotCount: timeSlots.length,
      timeSlots,
      availabilityByUserCount: Object.keys(availabilityByUser).length,
      daysOfWeek
    });
  }, [events, timeSlots, availabilityByUser, daysOfWeek]);

  const isLoading = availabilityLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto p-4">
      <LegacyViewTable
        events={events}
        availabilities={availabilityByUser}
        timeSlots={timeSlots}
        daysOfWeek={daysOfWeek}
      />
    </div>
  );
};

export default LegacyViewComponent;
