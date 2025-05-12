
import React from 'react';

interface HourCellProps {
  hour: number;
  isAvailable: boolean;
  onClick: (hour: number) => void;
}

const HourCell: React.FC<HourCellProps> = ({ hour, isAvailable, onClick }) => {
  return (
    <div
      className={`h-[60px] border-b border-r border-gray-200 
        ${isAvailable ? 'cursor-pointer hover:bg-blue-50' : 'bg-gray-300 cursor-not-allowed'}`}
      onClick={() => onClick(hour)}
      aria-disabled={!isAvailable}
    />
  );
};

export default HourCell;
