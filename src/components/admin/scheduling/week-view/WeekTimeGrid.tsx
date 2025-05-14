
import React from 'react';

interface WeekTimeGridProps {
  hours: number[];
  weekDays: Date[];
  onCellClick: (dayIndex: number, hour: number) => void;
  getAvailabilityClass: (dayIndex: number, hour: number) => string;
}

const WeekTimeGrid: React.FC<WeekTimeGridProps> = ({
  hours,
  weekDays,
  onCellClick,
  getAvailabilityClass
}) => {
  return (
    <div className="flex h-[calc(100%-48px)] overflow-auto">
      {/* Time labels column */}
      <div className="w-16 flex-shrink-0 sticky left-0 bg-white z-10">
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
      
      {/* Day columns */}
      {weekDays.map((day, dayIndex) => (
        <div key={dayIndex} className="flex-1 relative">
          {hours.map(hour => (
            <div
              key={hour}
              className={`h-[60px] border-b border-r border-gray-200 ${getAvailabilityClass(dayIndex, hour)}`}
              onClick={() => onCellClick(dayIndex, hour)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default WeekTimeGrid;
