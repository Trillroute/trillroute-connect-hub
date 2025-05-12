
import React from 'react';
import { format } from 'date-fns';

interface DayHeaderProps {
  currentDate: Date;
}

const DayHeader: React.FC<DayHeaderProps> = ({ currentDate }) => {
  // Ensure currentDate is a valid Date object before formatting
  const safeDate = currentDate instanceof Date && !isNaN(currentDate.getTime()) 
    ? currentDate 
    : new Date();

  return (
    <div className="h-12 border-b border-r border-gray-200 bg-white flex items-center justify-center">
      <div className="text-lg font-semibold">
        {format(safeDate, 'EEEE, MMMM d')}
      </div>
    </div>
  );
};

export default DayHeader;
