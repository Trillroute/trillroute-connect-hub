
import React from 'react';
import { AvailabilitySlot } from './weekViewUtils';

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
  // Filter slots for the current day
  const daySlots = availabilitySlots.filter(slot => slot.dayOfWeek === dayIndex);

  // Convert time values to position
  const calculateSlotPosition = (slot: AvailabilitySlot) => {
    const startMinutes = slot.startHour * 60 + slot.startMinute;
    const endMinutes = slot.endHour * 60 + slot.endMinute;
    const duration = endMinutes - startMinutes;
    
    // Start position from top in pixels (1 hour = 60px)
    const top = (startMinutes / 60) * 60;
    // Height in pixels
    const height = (duration / 60) * 60;
    
    return {
      top: `${top}px`,
      height: `${height}px`
    };
  };
  
  if (daySlots.length === 0) {
    return null;
  }

  return (
    <div>
      {daySlots.map((slot, index) => {
        const styles = calculateSlotPosition(slot);
        
        return (
          <div
            key={`available-${dayIndex}-${index}`}
            className="absolute left-0 right-0 bg-green-100 border border-green-300 rounded-sm opacity-50"
            style={{
              ...styles,
              zIndex: 5
            }}
            onClick={() => onAvailabilityClick(slot)}
          >
            <div className="truncate text-xs px-1 text-green-800">
              {slot.userName ? `${slot.userName} - Available` : 'Available'}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WeekAvailabilitySlots;
