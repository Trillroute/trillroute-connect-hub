
import React, { useMemo, useEffect } from 'react';
import { useCalendar } from '../context/CalendarContext';
import { Loader2 } from 'lucide-react';
import { getTimeSlots, getDaysOfWeek } from './legacyViewUtils';
import LegacyViewTable from './LegacyViewTable';
import { useStaffAvailability } from '@/hooks/useStaffAvailability';

const LegacyViewComponent: React.FC = () => {
  // Directly use the calendar context for events and availabilities
  const { currentDate, events, refreshEvents, availabilities } = useCalendar();
  const { availabilityByUser, loading: availabilityLoading, refetch } = useStaffAvailability();
  
  // Ensure we have the latest events and availability data
  useEffect(() => {
    console.log("Legacy view mounted, refreshing data...");
    const loadData = async () => {
      await refreshEvents();
      await refetch(); // This is the correct method name
      console.log("Legacy view data refreshed");
    };
    
    loadData();
  }, [refreshEvents, refetch]);
  
  // Determine which availability data to use - prefer filtered availabilities from context if available
  const effectiveAvailabilities = useMemo(() => {
    const contextAvailabilityCount = Object.keys(availabilities || {}).length;
    console.log(`LegacyView: Using ${contextAvailabilityCount > 0 ? 'filtered' : 'all staff'} availabilities`);
    return contextAvailabilityCount > 0 ? availabilities : availabilityByUser;
  }, [availabilities, availabilityByUser]);
  
  // Get all time slots from events and availabilities
  const timeSlots = useMemo(() => 
    getTimeSlots(events, effectiveAvailabilities), 
    [events, effectiveAvailabilities]
  );
  
  // Get days of the week starting from current date
  const daysOfWeek = useMemo(() => 
    getDaysOfWeek(currentDate), 
    [currentDate]
  );

  // Log data for debugging
  useEffect(() => {
    console.log("Legacy view data:", {
      eventCount: events.length,
      timeSlotCount: timeSlots.length,
      availabilityCount: Object.keys(effectiveAvailabilities || {}).length,
      daysCount: daysOfWeek.length
    });
  }, [events, timeSlots, effectiveAvailabilities, daysOfWeek]);

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
        availabilities={effectiveAvailabilities}
        timeSlots={timeSlots}
        daysOfWeek={daysOfWeek}
      />
    </div>
  );
};

export default LegacyViewComponent;
