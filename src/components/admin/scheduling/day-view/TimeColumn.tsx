
import React from 'react';

interface TimeColumnProps {
  hours: number[];
}

const TimeColumn: React.FC<TimeColumnProps> = ({ hours }) => {
  return (
    <div className="w-16 flex-shrink-0">
      {hours.map(hour => (
        <div 
          key={hour} 
          className="relative h-[60px] border-b border-r border-gray-200"
        >
          <div className="absolute -top-3 right-2 text-xs text-gray-500">
            {hour === 12 ? '12 PM' : hour < 12 ? `${hour} AM` : `${hour-12} PM`}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimeColumn;
