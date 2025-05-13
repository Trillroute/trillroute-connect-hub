
import React, { useMemo, useEffect, useState } from 'react';
import { useCalendar } from '../context/CalendarContext';
import { Loader2 } from 'lucide-react';
import { getTimeSlots, getDaysOfWeek } from './legacyViewUtils';
import LegacyViewTable from './LegacyViewTable';
import { useStaffAvailability } from '@/hooks/useStaffAvailability';
import { UserAvailabilityMap } from '../context/calendarTypes';

const LegacyViewComponent: React.FC = () => {
  // Use the calendar context for events and availabilities
  const { currentDate, events, refreshEvents, availabilities, setAvailabilities } = useCalendar();
  const { availabilityByUser, loading: availabilityLoading, refetch } = useStaffAvailability();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  
  // Ensure we have the latest events and availability data
  useEffect(() => {
    console.log("Legacy view: Initial mount or currentDate changed");
    const loadData = async () => {
      try {
        setIsInitialLoading(true);
        await Promise.all([
          refreshEvents(), 
          refetch()
        ]);
        
        // Update availabilities in the context if needed
        if (availabilityByUser && Object.keys(availabilityByUser).length > 0) {
          console.log("Legacy view: Setting availabilities from staff availability hook", availabilityByUser);
          setAvailabilities(availabilityByUser);
        }
      } catch (error) {
        console.error("Legacy view: Error refreshing data:", error);
      } finally {
        setIsInitialLoading(false);
      }
    };
    
    loadData();
  }, [currentDate]);
  
  // Determine which availability data to use - prefer filtered availabilities from context if available
  const effectiveAvailabilities = useMemo(() => {
    const contextAvailabilityCount = Object.keys(availabilities || {}).length;
    const hookAvailabilityCount = Object.keys(availabilityByUser || {}).length;
    
    console.log(`LegacyView: Available data sources - context: ${contextAvailabilityCount}, hook: ${hookAvailabilityCount}`);
    
    let result: UserAvailabilityMap = {};
    
    if (contextAvailabilityCount > 0) {
      console.log("LegacyView: Using filtered availabilities from context");
      result = availabilities || {};
    } else if (hookAvailabilityCount > 0) {
      console.log("LegacyView: Using all staff availabilities");
      result = availabilityByUser || {};
    }
    
    return result;
  }, [availabilities, availabilityByUser]);
  
  // Get all time slots from events and availabilities
  const timeSlots = useMemo(() => {
    console.log("LegacyView: Calculating time slots for", events?.length || 0, "events");
    return getTimeSlots(events || [], effectiveAvailabilities);
  }, [events, effectiveAvailabilities]);
  
  // Get days of the week starting from current date
  const daysOfWeek = useMemo(() => {
    console.log("LegacyView: Calculating days of week from", currentDate?.toDateString());
    return getDaysOfWeek(currentDate || new Date());
  }, [currentDate]);

  // Log data for debugging
  useEffect(() => {
    console.log("Legacy view rendered with:", {
      eventCount: events?.length || 0,
      timeSlotCount: timeSlots?.length || 0,
      availabilityCount: Object.keys(effectiveAvailabilities || {}).length || 0,
      daysCount: daysOfWeek?.length || 0,
      currentDate: currentDate?.toDateString()
    });
  }, [events, timeSlots, effectiveAvailabilities, daysOfWeek, currentDate]);

  const isLoading = availabilityLoading || isInitialLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!timeSlots || timeSlots.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 flex-col gap-4">
        <p className="text-gray-500 text-center">No time slots found for the selected period.</p>
        <p className="text-gray-400 text-sm text-center">Try selecting a different date range or adding events/availability.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto p-4">
      <LegacyViewTable
        events={events || []}
        availabilities={effectiveAvailabilities}
        timeSlots={timeSlots}
        daysOfWeek={daysOfWeek}
      />
    </div>
  );
};

export default LegacyViewComponent;
