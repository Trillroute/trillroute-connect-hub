
import React from 'react';
import WeekView from '../WeekView';

interface WeekViewComponentProps {
  onCreateEvent?: () => void;
}

export const WeekViewComponent: React.FC<WeekViewComponentProps> = ({
  onCreateEvent
}) => {
  return (
    <div className="h-full overflow-auto">
      <WeekView onCreateEvent={onCreateEvent} />
    </div>
  );
};
