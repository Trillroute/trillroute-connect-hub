
import React from 'react';
import { format } from 'date-fns';

interface DayHeaderProps {
  currentDate: Date;
}

const DayHeader: React.FC<DayHeaderProps> = ({ currentDate }) => {
  return (
    <div className="h-12 border-b border-r border-gray-200 bg-white flex items-center justify-center">
      <div className="text-lg font-semibold">
        {format(currentDate, 'EEEE, MMMM d')}
      </div>
    </div>
  );
};

export default DayHeader;
