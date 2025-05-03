
import React from 'react';
import { format, isSameDay } from 'date-fns';

interface WeekDayHeaderProps {
  day: Date;
  currentDate: Date;
}

const WeekDayHeader: React.FC<WeekDayHeaderProps> = ({ day, currentDate }) => {
  return (
    <div
      className={`flex-1 border-b border-r border-gray-200 h-12 ${
        isSameDay(day, new Date()) ? 'bg-blue-50' : 'bg-white'
      }`}
    >
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-xs uppercase text-gray-500">{format(day, 'EEE')}</div>
        <div className={`text-base font-medium ${
          isSameDay(day, new Date()) ? 'text-blue-600' : ''
        }`}>
          {format(day, 'd')}
        </div>
      </div>
    </div>
  );
};

export default WeekDayHeader;
