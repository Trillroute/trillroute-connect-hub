
import React from 'react';
import MonthView from '../MonthView';

interface MonthViewComponentProps {
  onDateClick: (date: Date) => void;
}

export const MonthViewComponent: React.FC<MonthViewComponentProps> = ({
  onDateClick
}) => {
  return (
    <div className="h-full overflow-auto">
      <MonthView onDateClick={onDateClick} />
    </div>
  );
};
