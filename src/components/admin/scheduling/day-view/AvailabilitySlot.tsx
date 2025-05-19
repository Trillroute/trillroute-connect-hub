
import React from 'react';
import { getCategoryBackgroundClass } from '../view-components/legacy-view/utils';

interface AvailabilitySlotProps {
  slot: {
    startHour: number;
    startMinute: number;
    endHour: number;
    endMinute: number;
    userId: string;
    userName?: string;
    category: string;
  };
  onClick: (slot: any) => void;
}

const AvailabilitySlot: React.FC<AvailabilitySlotProps> = ({ slot, onClick }) => {
  const calculatePosition = () => {
    // Calculate position relative to calendar start time (7:00 AM)
    const hourOffset = slot.startHour - 7; // Adjust for calendar starting at 7 AM
    const startPosition = (hourOffset * 60) + slot.startMinute; // Convert to minutes position
    
    // Calculate duration in minutes
    const startTimeInMinutes = (slot.startHour * 60) + slot.startMinute;
    const endTimeInMinutes = (slot.endHour * 60) + slot.endMinute;
    const durationInMinutes = endTimeInMinutes - startTimeInMinutes;
    
    // Convert to pixels (1 minute = 1px)
    return {
      top: `${startPosition}px`,
      height: `${durationInMinutes}px`,
    };
  };
  
  return (
    <div
      className={`absolute left-1 right-1 rounded px-2 py-1 border overflow-hidden text-sm group cursor-pointer hover:opacity-90 ${getCategoryBackgroundClass(slot.category)}`}
      style={calculatePosition()}
      onClick={() => onClick(slot)}
    >
      <div className="flex justify-between">
        <span className="font-semibold group-hover:underline">
          {slot.userName ? `${slot.userName}` : 'Available'}
        </span>
        <span className="text-xs px-1.5 py-0.5 rounded-full bg-white/50">
          {slot.category}
        </span>
      </div>
      <div className="text-xs opacity-90">
        {`${slot.startHour}:${slot.startMinute.toString().padStart(2, '0')} - ${slot.endHour}:${slot.endMinute.toString().padStart(2, '0')}`}
      </div>
    </div>
  );
};

export default AvailabilitySlot;
