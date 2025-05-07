
import React, { useEffect } from 'react';
import { UserAvailability } from '@/services/userAvailabilityService';
import AvailabilitySlotCard from './AvailabilitySlotCard';
import EmptyDayMessage from './EmptyDayMessage';

interface AvailabilitySlotsGridProps {
  slots: UserAvailability[];
  dayName: string;
  onEditSlot: (slot: UserAvailability) => void;
  onDeleteSlot: (id: string) => Promise<boolean>;
}

const AvailabilitySlotsGrid: React.FC<AvailabilitySlotsGridProps> = ({
  slots,
  dayName,
  onEditSlot,
  onDeleteSlot
}) => {
  // Enhanced logging for better debugging
  useEffect(() => {
    console.log(`[AvailabilitySlotsGrid] Rendering slots for ${dayName}:`, 
      slots ? slots.map(slot => ({
        id: slot.id,
        time: `${slot.startTime}-${slot.endTime}`,
        userId: slot.userId
      })) : 'No slots');
  }, [slots, dayName]);
  
  if (!slots || slots.length === 0) {
    return <EmptyDayMessage dayName={dayName} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
      {slots.map(slot => (
        <AvailabilitySlotCard
          key={slot.id}
          slot={slot}
          onEdit={() => onEditSlot(slot)}
          onDelete={() => onDeleteSlot(slot.id)}
        />
      ))}
    </div>
  );
};

export default AvailabilitySlotsGrid;
