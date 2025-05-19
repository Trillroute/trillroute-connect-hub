
import React from 'react';
import { AvailabilitySlot, getCategoryColor } from './weekViewUtils';
import { handleAvailabilitySlotClick } from '../utils/availabilitySlotHandlers';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  const slotsForDay = availabilitySlots.filter(slot => slot.dayOfWeek === dayIndex);

  return (
    <>
      {slotsForDay.map((slot, index) => {
        // Calculate position based on time
        const startMinutesFromReference = ((slot.startHour - 7) * 60) + slot.startMinute;
        const durationMinutes = ((slot.endHour - slot.startHour) * 60) + (slot.endMinute - slot.startMinute);
        
        return (
          <TooltipProvider key={`${slot.userId}-${index}`}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={`absolute rounded border cursor-pointer hover:opacity-90 ${getCategoryColor(slot.category)}`}
                  style={{
                    top: `${startMinutesFromReference}px`,
                    height: `${durationMinutes}px`,
                    left: '10%',
                    width: '80%',
                  }}
                  onClick={() => {
                    handleAvailabilitySlotClick(slot);
                    onAvailabilityClick(slot);
                  }}
                >
                  <div className="p-1 text-xs">
                    <div className="font-semibold truncate">{slot.userName || 'Available'}</div>
                    <div className="opacity-80">{slot.category}</div>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p><strong>{slot.category}</strong> - {slot.userName || 'Available'}</p>
                <p className="text-xs">Click to create an event</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </>
  );
};

export default WeekAvailabilitySlots;
