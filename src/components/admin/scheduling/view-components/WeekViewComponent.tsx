
import React, { useMemo } from 'react';
import WeekView from '../WeekView';
import { useCalendar } from '../context/CalendarContext';
import { AvailabilitySlot } from '../week-view/weekViewUtils';
import { CalendarEvent } from '../context/calendarTypes';

interface WeekViewComponentProps {
  showAvailability?: boolean;
  onCreateEvent?: () => void;
  onEditEvent?: (event: CalendarEvent) => void;
  onDeleteEvent?: (event: CalendarEvent) => void;
}

export const WeekViewComponent: React.FC<WeekViewComponentProps> = ({
  showAvailability = true,
  onCreateEvent,
  onEditEvent,
  onDeleteEvent
}) => {
  const { currentDate, events, availabilities } = useCalendar();
  
  // Process availability slots for the week view
  const availabilitySlots = useMemo(() => {
    // Always show availability slots in week view
    if (!availabilities) return [];
    
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
    
    console.log('WeekViewComponent: Processed availability slots:', slots.length);
    
    return slots;
  }, [availabilities]);
  
  return (
    <WeekView 
      onCreateEvent={onCreateEvent}
    />
  );
};
