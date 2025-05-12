
import React from 'react';

interface AvailabilitySlotProps {
  top: number;
  height: number;
  userName: string;
  category?: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}

const AvailabilitySlot: React.FC<AvailabilitySlotProps> = ({
  top,
  height,
  userName,
  category = 'Session',
  startHour,
  startMinute,
  endHour,
  endMinute
}) => {
  // Helper function to format hours
  const formatTime = (hour: number, minute: number) => {
    return `${hour}:${minute.toString().padStart(2, '0')}`;
  };
  
  // Select background color based on category
  const getBackgroundColor = (category: string) => {
    switch(category.toLowerCase()) {
      case 'session': return 'bg-green-100 border-green-300';
      case 'break': return 'bg-blue-100 border-blue-300';
      case 'office': return 'bg-purple-100 border-purple-300';
      case 'meeting': return 'bg-yellow-100 border-yellow-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };
  
  return (
    <div 
      className={`absolute left-1 right-1 rounded-md border ${getBackgroundColor(category)} p-2 z-10 text-sm overflow-hidden`}
      style={{ 
        top: `${top}px`, 
        height: `${height}px`, 
        opacity: 0.85
      }}
    >
      <div className="font-medium">{userName}</div>
      <div className="text-xs">{category}</div>
      <div className="text-xs mt-1">
        {formatTime(startHour, startMinute)} - {formatTime(endHour, endMinute)}
      </div>
    </div>
  );
};

export default AvailabilitySlot;
