
import React from 'react';
import { format, isToday } from 'date-fns';

interface WeekDayHeaderProps {
  day: Date;
  isCurrentMonth?: boolean;
}

const WeekDayHeader: React.FC<WeekDayHeaderProps> = ({ day, isCurrentMonth = true }) => {
  const isCurrentDay = isToday(day);
  
  return (
    <div className={`flex-1 h-12 border-b border-r border-gray-200 ${isCurrentDay ? 'bg-blue-50' : 'bg-white'}`}>
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-xs text-gray-500">
          {format(day, 'EEE')}
        </div>
        <div className={`text-sm font-medium ${isCurrentDay ? 'text-blue-600' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}`}>
          {format(day, 'd')}
        </div>
      </div>
    </div>
  );
};

export default WeekDayHeader;
