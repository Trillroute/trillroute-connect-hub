
import React from 'react';
import { AvailabilitySlot } from './weekViewUtils';
import { getCategoryColor } from './weekViewUtils';

interface WeekAvailabilitySlotsProps {
  availabilitySlots: AvailabilitySlot[];
  dayIndex: number;
  onAvailabilityClick: (slot: AvailabilitySlot) => void;
}

const WeekAvailabilitySlots: React.FC<WeekAvailabilitySlotsProps> = ({
  availabilitySlots,
  dayIndex,
  onAvailabilityClick
}) => {
  // Filter slots for this day
  const slotsForThisDay = availabilitySlots.filter(slot => slot.dayOfWeek === dayIndex);
  
  const calculatePosition = (slot: AvailabilitySlot) => {
    // Calculate position relative to calendar start time (7 AM)
    const startHour = slot.startHour - 7; // Adjust for calendar starting at 7 AM
    const startPosition = (startHour * 60) + slot.startMinute; // Convert to minutes position
    
    // Calculate duration in minutes
    const startTimeInMinutes = (slot.startHour * 60) + slot.startMinute;
    const endTimeInMinutes = (slot.endHour * 60) + slot.endMinute;
    const durationInMinutes = endTimeInMinutes - startTimeInMinutes;
    
    // Convert to pixels (1 minute = 1px)
    return {
      top: `${startPosition}px`,
      height: `${durationInMinutes}px`,
      left: '10%',
      width: '80%',
    };
  };
  
  return (
    <>
      {slotsForThisDay.map((slot, index) => (
        <div
          key={index}
          className={`absolute rounded-md border overflow-hidden text-sm cursor-pointer hover:opacity-90 z-10 ${getCategoryColor(slot.category)}`}
          style={calculatePosition(slot)}
          onClick={() => onAvailabilityClick(slot)}
        >
          <div className="px-2 py-1">
            <div className="text-xs font-semibold truncate">
              {slot.userName || 'Available'}
            </div>
            <div className="text-xs opacity-90">
              {`${slot.startHour}:${slot.startMinute.toString().padStart(2, '0')} - ${slot.endHour}:${slot.endMinute.toString().padStart(2, '0')}`}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default WeekAvailabilitySlots;
