
import React from 'react';

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
  // Get color based on category
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'session':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'break':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'office':
        return 'bg-purple-100 border-purple-300 text-purple-800';
      case 'meeting':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'class setup':
        return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'qc':
        return 'bg-pink-100 border-pink-300 text-pink-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

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
      className={`absolute left-1 right-1 rounded px-2 py-1 border overflow-hidden text-sm group cursor-pointer hover:opacity-90 ${getCategoryColor(slot.category)}`}
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
