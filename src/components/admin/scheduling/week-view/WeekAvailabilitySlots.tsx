
import React from 'react';
import { AvailabilitySlot } from './weekViewUtils';
import AvailabilitySlotItem from './AvailabilitySlot';

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
  // Get availability for a specific day of the week
  const getAvailabilityForDay = (dayOfWeek: number) => {
    return availabilitySlots.filter(slot => slot.dayOfWeek === dayOfWeek);
  };

  // Render the availability slots for this day
  const dayAvailabilities = getAvailabilityForDay(dayIndex);

  return (
    <>
      {dayAvailabilities.map((slot, slotIndex) => (
        <AvailabilitySlotItem
          key={`slot-${dayIndex}-${slot.startHour}-${slot.startMinute}-${slotIndex}`}
          slot={slot}
          slotIndex={slotIndex}
          dayIndex={dayIndex}
          onClick={onAvailabilityClick}
        />
      ))}
    </>
  );
};

export default WeekAvailabilitySlots;
