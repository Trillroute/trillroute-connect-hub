
import React, { useMemo } from 'react';
import WeekView from '../WeekView';
import { useCalendar } from '../context/CalendarContext';
import { AvailabilitySlot } from '../week-view/weekViewUtils';

interface WeekViewComponentProps {
  showAvailability?: boolean;
}

export const WeekViewComponent: React.FC<WeekViewComponentProps> = ({
  showAvailability = true
}) => {
  const { currentDate, events, availabilities } = useCalendar();
  
  // Process availability slots for the week view
  const availabilitySlots = useMemo(() => {
    // Return empty array if showAvailability is false
    if (!showAvailability || !availabilities) return [];
    
    const slots: AvailabilitySlot[] = [];
    
    Object.entries(availabilities).forEach(([userId, userData]) => {
      if (!userData || !userData.slots) return;
      
      userData.slots.forEach(slot => {
        try {
          const [startHour, startMinute] = slot.startTime.split(':').map(Number);
          const [endHour, endMinute] = slot.endTime.split(':').map(Number);
          
          if (
            typeof startHour === 'number' && !isNaN(startHour) &&
            typeof startMinute === 'number' && !isNaN(startMinute) &&
            typeof endHour === 'number' && !isNaN(endHour) &&
            typeof endMinute === 'number' && !isNaN(endMinute)
          ) {
            slots.push({
              userId,
              userName: userData.name || 'Unknown',
              dayOfWeek: slot.dayOfWeek,
              startHour,
              startMinute,
              endHour,
              endMinute,
              category: slot.category || 'Default'
            });
          }
        } catch (error) {
          console.error('Error processing availability slot for week view:', error);
        }
      });
    });
    
    return slots;
  }, [availabilities, showAvailability]);
  
  return (
    <WeekView 
      onCreateEvent={undefined}
    />
  );
};
