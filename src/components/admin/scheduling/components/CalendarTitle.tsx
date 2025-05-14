
import React from 'react';
import { CalendarViewMode } from '../types';

interface CalendarTitleProps {
  viewMode: CalendarViewMode;
  currentDate: Date;
}

const CalendarTitle: React.FC<CalendarTitleProps> = ({ viewMode, currentDate }) => {
  // Format title based on view mode and current date
  const formatTitle = () => {
    const options = { month: 'long' as const, year: 'numeric' as const };
    
    switch (viewMode) {
      case 'day':
        return currentDate.toLocaleDateString('en-US', {
          ...options,
          day: 'numeric' as const,
        });
      case 'week':
        return `Week of ${currentDate.toLocaleDateString('en-US', {
          month: 'short' as const,
          day: 'numeric' as const,
        })}`;
      default:
        return currentDate.toLocaleDateString('en-US', options);
    }
  };

  return <span>{formatTitle()}</span>;
};

export default CalendarTitle;
