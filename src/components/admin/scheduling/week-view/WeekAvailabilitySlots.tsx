
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
  // Filter slots for this day - dayIndex matches the day of week (0 = Sunday, 1 = Monday, etc.)
  const slotsForDay = availabilitySlots.filter(slot => slot.dayOfWeek === dayIndex);

  console.log(`WeekAvailabilitySlots: Day ${dayIndex} has ${slotsForDay.length} slots out of ${availabilitySlots.length} total slots`);
  console.log(`WeekAvailabilitySlots: Available slots for day ${dayIndex}:`, slotsForDay);

  return (
    <>
      {slotsForDay.map((slot, index) => {
        // The time grid shows hours 7-20 (7 AM to 8 PM), each hour cell is 64px (h-16)
        // Calculate position based on the hour within the visible grid
        const startHour = slot.startHour;
        const startMinute = slot.startMinute;
        const endHour = slot.endHour;
        const endMinute = slot.endMinute;
        
        // Calculate position relative to the visible grid (starts at hour 7)
        const gridStartHour = 7;
        const hourCellHeight = 64; // h-16 = 64px
        
        // Calculate minutes from the start of the visible grid (7 AM)
        const startMinutesFromGridStart = ((startHour - gridStartHour) * 60) + startMinute;
        const endMinutesFromGridStart = ((endHour - gridStartHour) * 60) + endMinute;
        const durationMinutes = endMinutesFromGridStart - startMinutesFromGridStart;
        
        // Convert to pixels - each hour (60 minutes) = 64px (h-16)
        const pixelsPerMinute = hourCellHeight / 60;
        
        // Position relative to the start of the visible grid
        const topOffset = Math.max(0, startMinutesFromGridStart * pixelsPerMinute);
        const height = Math.max(durationMinutes * pixelsPerMinute, 20); // Minimum 20px height
        
        // Only show slots that are within the visible time range (7 AM - 8 PM)
        if (startHour < gridStartHour || startHour >= gridStartHour + 14) {
          console.log(`WeekAvailabilitySlots: Slot ${index} is outside visible hours (${startHour}:${startMinute})`);
          return null;
        }
        
        console.log(`WeekAvailabilitySlots: Slot ${index} positioning:`, {
          startHour: slot.startHour,
          startMinute: slot.startMinute,
          endHour: slot.endHour,
          endMinute: slot.endMinute,
          startMinutesFromGridStart,
          endMinutesFromGridStart,
          durationMinutes,
          topOffset,
          height,
          category: slot.category,
          userName: slot.userName
        });
        
        return (
          <TooltipProvider key={`${slot.userId}-${index}`}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={`absolute rounded border cursor-pointer hover:opacity-70 z-10 opacity-30 ${getCategoryColor(slot.category)}`}
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
