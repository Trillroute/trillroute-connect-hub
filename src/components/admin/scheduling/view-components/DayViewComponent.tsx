
import React from 'react';
import DayView from '../DayView';

interface DayViewComponentProps {
  onCreateEvent?: () => void;
}

export const DayViewComponent: React.FC<DayViewComponentProps> = ({
  onCreateEvent
}) => {
  return (
    <div className="h-full overflow-auto">
      <DayView onCreateEvent={onCreateEvent} />
    </div>
  );
};
