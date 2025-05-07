
import React from 'react';

interface EmptyDayMessageProps {
  dayName: string;
}

const EmptyDayMessage: React.FC<EmptyDayMessageProps> = ({ dayName }) => {
  return (
    <div className="text-center py-4 text-gray-500">
      No availability slots defined for {dayName}
    </div>
  );
};

export default EmptyDayMessage;
