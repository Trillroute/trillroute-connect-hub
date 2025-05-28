
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

  console.log(`WeekAvailabilitySlots: Rendering ${slotsForDay.length} slots for day ${dayIndex}`);

  return (
    <>
      {slotsForDay.map((slot, index) => {
        // Calculate position based on time - each hour cell is 64px (h-16)
        // Grid starts from hour 0, so we calculate position relative to that
        const startHourPosition = slot.startHour;
        const startMinuteOffset = slot.startMinute;
        const endHourPosition = slot.endHour;
        const endMinuteOffset = slot.endMinute;
        
        // Calculate total duration in minutes
        const totalStartMinutes = (startHourPosition * 60) + startMinuteOffset;
        const totalEndMinutes = (endHourPosition * 60) + endMinuteOffset;
        const durationMinutes = totalEndMinutes - totalStartMinutes;
        
        // Convert to pixels - each hour (60 minutes) = 64px (h-16)
        const pixelsPerMinute = 64 / 60;
        const topOffset = totalStartMinutes * pixelsPerMinute;
        const height = durationMinutes * pixelsPerMinute;
        
        console.log(`WeekAvailabilitySlots: Slot ${index} positioning:`, {
          startHour: slot.startHour,
          startMinute: slot.startMinute,
          endHour: slot.endHour,
          endMinute: slot.endMinute,
          topOffset,
          height,
          category: slot.category
        });
        
        return (
          <TooltipProvider key={`${slot.userId}-${index}`}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={`absolute rounded border cursor-pointer hover:opacity-90 z-10 ${getCategoryColor(slot.category)}`}
                  style={{
                    top: `${topOffset}px`,
                    height: `${height}px`,
                    left: '2px',
                    right: '2px',
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
