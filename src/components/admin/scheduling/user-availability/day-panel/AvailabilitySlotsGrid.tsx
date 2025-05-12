
import React from 'react';
import { UserAvailability } from '@/services/userAvailabilityService';
import AvailabilitySlotCard from './AvailabilitySlotCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import EmptyDayMessage from './EmptyDayMessage';

interface AvailabilitySlotsGridProps {
  slots: UserAvailability[];
  dayName: string;
  onEditSlot: (slot: UserAvailability) => void;
  onDeleteSlot: (id: string) => Promise<boolean>;
  onAddSlot?: (hour?: number, minute?: number) => void;
}

const AvailabilitySlotsGrid: React.FC<AvailabilitySlotsGridProps> = ({
  slots,
  dayName,
  onEditSlot,
  onDeleteSlot,
  onAddSlot
}) => {
  // Generate time slots for the day (8 AM to 10 PM)
  const timeSlots = [];
  for (let hour = 8; hour <= 22; hour++) {
    timeSlots.push(hour);
  }
  
  const handleTimeSlotClick = (hour: number) => {
    if (onAddSlot) {
      onAddSlot(hour, 0);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">{dayName}</h3>
        <Button 
          size="sm"
          variant="outline"
          className="flex items-center"
          onClick={() => onAddSlot && onAddSlot()}
        >
          <Plus className="mr-1 h-4 w-4" /> Add Slot
        </Button>
      </div>
      
      {slots.length > 0 ? (
        <div className="grid grid-cols-1 gap-2">
          {slots.map((slot) => (
            <AvailabilitySlotCard
              key={slot.id}
              slot={slot}
              onEdit={() => onEditSlot(slot)}
              onDelete={() => onDeleteSlot(slot.id)}
            />
          ))}
        </div>
      ) : (
        <div>
          <EmptyDayMessage dayName={dayName} />
          
          <div className="mt-4 grid grid-cols-3 gap-2">
            {timeSlots.map((hour) => (
              <Button
                key={hour}
                variant="outline"
                size="sm"
                className="text-xs py-1 text-gray-600"
                onClick={() => handleTimeSlotClick(hour)}
              >
                {hour}:00
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailabilitySlotsGrid;
