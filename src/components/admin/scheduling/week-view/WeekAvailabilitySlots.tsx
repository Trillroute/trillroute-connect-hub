
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
        // The time grid shows hours 0-23, each hour cell is 64px (h-16)
        // Calculate position based on the hour within the grid
        const startHour = slot.startHour;
        const startMinute = slot.startMinute;
        const endHour = slot.endHour;
        const endMinute = slot.endMinute;
        
        // Calculate total minutes from start of day (midnight)
        const startTotalMinutes = (startHour * 60) + startMinute;
        const endTotalMinutes = (endHour * 60) + endMinute;
        const durationMinutes = endTotalMinutes - startTotalMinutes;
        
        // Convert to pixels - each hour (60 minutes) = 64px (h-16)
        const pixelsPerMinute = 64 / 60;
        
        // Position relative to the start of the grid (hour 0)
        const topOffset = startTotalMinutes * pixelsPerMinute;
        const height = Math.max(durationMinutes * pixelsPerMinute, 20); // Minimum 20px height
        
        console.log(`WeekAvailabilitySlots: Slot ${index} positioning:`, {
          startHour: slot.startHour,
          startMinute: slot.startMinute,
          endHour: slot.endHour,
          endMinute: slot.endMinute,
          startTotalMinutes,
          endTotalMinutes,
          durationMinutes,
          topOffset,
          height,
          category: slot.category
        });
        
        return (
          <TooltipProvider key={`${slot.userId}-${index}`}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={`absolute rounded border cursor-pointer hover:opacity-90 z-20 ${getCategoryColor(slot.category)}`}
                  style={{
                    top: `${topOffset}px`,
                    height: `${height}px`,
                    left: '4px',
                    right: '4px',
                  }}
                  onClick={() => {
                    handleAvailabilitySlotClick(slot);
                    onAvailabilityClick(slot);
                  }}
                >
                  <div className="p-1 text-xs overflow-hidden">
                    <div className="font-semibold truncate">{slot.userName || 'Available'}</div>
                    <div className="opacity-80 truncate">{slot.category}</div>
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
