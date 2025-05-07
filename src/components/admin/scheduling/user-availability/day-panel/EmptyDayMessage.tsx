
import React from 'react';
import { PlusCircle } from 'lucide-react';

interface EmptyDayMessageProps {
  dayName: string;
}

const EmptyDayMessage: React.FC<EmptyDayMessageProps> = ({ dayName }) => {
  return (
    <div className="text-center py-8 px-4 border border-dashed border-gray-300 rounded-md bg-gray-50">
      <p className="text-gray-500 mb-2">No availability slots defined for {dayName}</p>
      <p className="text-sm text-gray-400">
        <PlusCircle className="inline-block mr-1 h-4 w-4" />
        Click the plus button on the accordion header to add a slot
      </p>
    </div>
  );
};

export default EmptyDayMessage;
