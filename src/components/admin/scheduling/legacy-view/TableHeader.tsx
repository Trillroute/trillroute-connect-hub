
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { formatTimeDisplay } from './legacyViewUtils';

interface TableHeaderProps {
  timeSlots: string[];
}

const TableHeader: React.FC<TableHeaderProps> = ({ timeSlots }) => {
  return (
    <thead>
      <tr className="bg-gray-100">
        <th className="p-2 border text-left min-w-[100px]">Time slot</th>
        {timeSlots.map((slot, index) => (
          <th key={index} className="p-2 border text-center min-w-[120px]">
            <div className="flex items-center justify-center gap-2">
              <ChevronDown className="h-4 w-4" />
              {formatTimeDisplay(slot)}
            </div>
            <div className="text-xs text-gray-500">
              Calendar view details
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
