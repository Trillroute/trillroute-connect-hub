
import React from 'react';
import { PlusCircle } from 'lucide-react';

interface EmptyDayMessageProps {
  dayName: string;
}

const EmptyDayMessage: React.FC<EmptyDayMessageProps> = ({ dayName }) => {
  return (
    <div className="text-center py-8 px-4 border border-dashed border-gray-300 rounded-md bg-gray-50">
      <p className="text-gray-500 mb-2">No availability slots defined for {dayName}</p>
      <p className="text-sm text-gray-400 flex items-center justify-center">
        <PlusCircle className="inline-block mr-1 h-4 w-4" />
        Click the plus button on the accordion header to add a slot
      </p>
      <p className="text-xs text-gray-400 mt-2">
        Slots are stored in the user_availability table
      </p>
    </div>
  );
};

export default EmptyDayMessage;
