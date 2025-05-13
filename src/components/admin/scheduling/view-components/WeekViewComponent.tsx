
import React, { useEffect } from 'react';
import WeekView from '../WeekView';
import { CalendarEvent } from '../context/calendarTypes';
import { useCalendar } from '../context/CalendarContext';
import { useUserAvailability } from '@/hooks/useUserAvailability';
import { useAuth } from '@/hooks/useAuth';

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
  const { user } = useAuth();
  const { events, refreshEvents, availabilities, setAvailabilities } = useCalendar();
  const { refreshAvailability, availabilityData, isLoading } = useUserAvailability(user?.id);
  
  // Force refresh events and availability when the component mounts
  useEffect(() => {
    console.log('WeekViewComponent: Refreshing events and availability data');
    
    const loadData = async () => {
      await refreshEvents();
      
      if (refreshAvailability) {
        const data = await refreshAvailability();
        if (data && Object.keys(data).length > 0) {
          console.log('Setting availabilities from refreshAvailability:', data);
          setAvailabilities(data);
        }
      }
    };
    
    loadData();
    
    // Also update availabilities from useUserAvailability if available
    if (availabilityData && Object.keys(availabilityData).length > 0) {
      console.log('Setting availabilities from availabilityData:', availabilityData);
      setAvailabilities(availabilityData);
    }
    
    console.log('WeekViewComponent: Events count:', events.length);
    console.log('WeekViewComponent: Availability data:', Object.keys(availabilities).length);
  }, [refreshEvents, refreshAvailability, setAvailabilities, availabilityData, events.length, availabilities]);
  
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
