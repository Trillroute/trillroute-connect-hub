
import React from 'react';
import { format, isSameDay } from 'date-fns';

interface WeekDayHeaderProps {
  day: Date;
  currentDate: Date;
}

const WeekDayHeader: React.FC<WeekDayHeaderProps> = ({ day, currentDate }) => {
  // Ensure day is a valid Date object before formatting
  const safeDay = day instanceof Date && !isNaN(day.getTime()) 
    ? day 
    : new Date();
    
  const isToday = isSameDay(safeDay, new Date());

  return (
    <div
      className={`flex-1 border-b border-r border-gray-200 h-12 ${
        isToday ? 'bg-blue-50' : 'bg-white'
      }`}
    >
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-xs uppercase text-gray-500">{format(safeDay, 'EEE')}</div>
        <div className={`text-base font-medium ${
          isToday ? 'text-blue-600' : ''
        }`}>
          {format(safeDay, 'd')}
        </div>
      </div>
    </div>
  );
};

export default WeekDayHeader;
