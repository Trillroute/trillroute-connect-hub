
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
    if (onCellClick) {
      onCellClick();
    }
  };
  
  return (
    <>
      {hours.map(hour => (
        <div
          key={hour}
          className={`h-[60px] border-b border-r border-gray-200 
            ${isSameDay(day, currentDate) ? 'bg-blue-50' : ''} 
            ${isAvailable && isAvailable(hour, dayIndex) 
              ? 'cursor-pointer hover:bg-blue-100' 
              : 'bg-gray-100'}
            ${onCellClick ? 'cursor-pointer' : ''}`}
          onClick={handleClick}
        ></div>
      ))}
    </>
  );
};

export default WeekTimeGrid;
