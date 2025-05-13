
import React from 'react';
import { AvailabilitySlot, getCategoryColor } from './weekViewUtils';

interface AvailabilitySlotProps {
  slot: AvailabilitySlot;
  slotIndex: number;
  dayIndex: number;
  onClick: (slot: AvailabilitySlot) => void;
}

const AvailabilitySlotItem: React.FC<AvailabilitySlotProps> = ({
  slot,
  slotIndex,
  dayIndex,
  onClick
}) => {
  // Calculate the position and height of the slot based on time
  // Start position: Each hour = 60px height, startHour - 7 to offset from 7AM
  const startPercentage = ((slot.startHour - 7) + slot.startMinute / 60) * 60; // 60px per hour
  const duration = (slot.endHour - slot.startHour) + (slot.endMinute - slot.startMinute) / 60;
  const height = duration * 60; // 60px per hour
  
  // Format minutes to always show two digits (e.g., 9:05 instead of 9:5)
  const formatTime = (hour: number, minute: number) => 
    `${hour}:${minute.toString().padStart(2, '0')}`;
  
  return (
    <div
      key={`avail-${dayIndex}-${slot.startHour}-${slot.startMinute}-${slot.userId}-${slotIndex}`}
      className={`absolute left-1 right-1 rounded px-2 py-1 border overflow-hidden text-sm group cursor-pointer hover:opacity-90 z-10 ${getCategoryColor(slot.category)}`}
      style={{
        top: `${startPercentage}px`,
        height: `${Math.max(20, height)}px`, // Ensure minimum height for visibility
      }}
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
        {`${formatTime(slot.startHour, slot.startMinute)} - ${formatTime(slot.endHour, slot.endMinute)}`}
      </div>
    </div>
  );
};

export default AvailabilitySlotItem;
