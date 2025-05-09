
import React from 'react';
import { isSameDay } from 'date-fns';

interface WeekTimeGridProps {
  hours: number[];
  day: Date;
  currentDate: Date;
  onCellClick?: () => void;
  isAvailable?: (hour: number, dayIndex: number) => boolean;
  dayIndex: number;
}

const WeekTimeGrid: React.FC<WeekTimeGridProps> = ({ 
  hours, 
  day, 
  currentDate, 
  onCellClick,
  isAvailable,
  dayIndex 
}) => {
  const handleClick = () => {
    // Only trigger click event if the cell is available
    if (onCellClick && isAvailable && isAvailable(hours[0], dayIndex)) {
      onCellClick();
    }
  };
  
  return (
    <>
      {hours.map(hour => {
        const isTimeSlotAvailable = isAvailable && isAvailable(hour, dayIndex);
        
        return (
          <div
            key={hour}
            className={`h-[60px] border-b border-r border-gray-200 
              ${isSameDay(day, currentDate) ? 'bg-blue-50' : ''} 
              ${isTimeSlotAvailable 
                ? 'cursor-pointer hover:bg-blue-100' 
                : 'bg-gray-300'}
              ${onCellClick && isTimeSlotAvailable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            onClick={handleClick}
            aria-disabled={!isTimeSlotAvailable}
          ></div>
        );
      })}
    </>
  );
};

export default WeekTimeGrid;
