
import React from 'react';
import MonthView from '../MonthView';

interface MonthViewComponentProps {
  onDateClick: (date: Date) => void;
  onCreateEvent?: () => void;
}

export const MonthViewComponent: React.FC<MonthViewComponentProps> = ({
  onDateClick,
  onCreateEvent
}) => {
  return (
    <div className="h-full overflow-auto">
      <MonthView 
        onDateClick={onDateClick}
        onCreateEvent={onCreateEvent}
      />
    </div>
  );
};
