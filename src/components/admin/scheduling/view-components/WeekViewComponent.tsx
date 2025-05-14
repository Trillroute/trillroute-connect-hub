
import React, { useState, useEffect } from 'react';
import WeekView from '../WeekView';
import { useCalendar } from '../context/CalendarContext';
import { AvailabilitySlot } from '../week-view/weekViewUtils';

interface WeekViewComponentProps {
  showAvailability?: boolean;
  allowEventCreation?: boolean;
}

export const WeekViewComponent: React.FC<WeekViewComponentProps> = ({
  showAvailability = true,
  allowEventCreation = true
}) => {
  const { currentDate, events, availabilities } = useCalendar();
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
  
  // Process availability data here if needed
  useEffect(() => {
    if (!showAvailability) {
      setAvailabilitySlots([]);
      return;
    }
    
    // Process availability data
    const processedSlots: AvailabilitySlot[] = [];
    
    // Process availabilities similar to how it's done in WeekView
    Object.entries(availabilities || {}).forEach(([userId, userData]) => {
      if (userData?.slots && Array.isArray(userData.slots)) {
        userData.slots.forEach(slot => {
          if (slot.startTime && slot.endTime && typeof slot.dayOfWeek === 'number') {
            const startTimeParts = slot.startTime.split(':');
            const endTimeParts = slot.endTime.split(':');
            
            if (startTimeParts.length >= 2 && endTimeParts.length >= 2) {
              const startHour = parseInt(startTimeParts[0], 10);
              const startMinute = parseInt(startTimeParts[1], 10);
              const endHour = parseInt(endTimeParts[0], 10);
              const endMinute = parseInt(endTimeParts[1], 10);
              
              processedSlots.push({
                dayOfWeek: slot.dayOfWeek,
                startHour,
                startMinute,
                endHour,
                endMinute,
                userId: slot.user_id || userId,
                userName: userData.name,
                category: slot.category || 'General'
              });
            }
          }
        });
      }
    });
    
    setAvailabilitySlots(processedSlots);
  }, [availabilities, showAvailability]);
  
  return (
    <div className="h-full overflow-auto">
      <WeekView 
        onCreateEvent={() => {}} 
      />
    </div>
  );
};
