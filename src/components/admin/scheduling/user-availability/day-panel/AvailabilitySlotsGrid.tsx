
import React from 'react';
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
  if (slots.length === 0) {
    return <EmptyDayMessage dayName={dayName} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {slots.map(slot => (
        <AvailabilitySlotCard
          key={slot.id}
          slot={slot}
          onEdit={onEditSlot}
          onDelete={onDeleteSlot}
        />
      ))}
    </div>
  );
};

export default AvailabilitySlotsGrid;
