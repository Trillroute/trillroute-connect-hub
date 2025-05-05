
import React from 'react';
import { isSameDay } from 'date-fns';

interface WeekTimeGridProps {
  hours: number[];
  day: Date;
  currentDate: Date;
  onCellClick?: () => void;
}

const WeekTimeGrid: React.FC<WeekTimeGridProps> = ({ hours, day, currentDate, onCellClick }) => {
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
          className={`h-[60px] border-b border-r border-gray-200 ${
            isSameDay(day, currentDate) ? 'bg-blue-50' : ''
          } ${onCellClick ? 'cursor-pointer' : ''}`}
          onClick={handleClick}
        ></div>
      ))}
    </>
  );
};

export default WeekTimeGrid;
