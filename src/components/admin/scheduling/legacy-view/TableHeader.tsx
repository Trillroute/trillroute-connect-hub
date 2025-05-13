
import React, { memo } from 'react';
import { format } from 'date-fns';

interface TableHeaderProps {
  daysOfWeek: Date[];
}

const TableHeader: React.FC<TableHeaderProps> = memo(({ daysOfWeek }) => {
  return (
    <thead>
      <tr className="bg-gray-100">
        <th className="p-2 border text-left min-w-[100px]">Time</th>
        {daysOfWeek.map((date, index) => (
          <th key={`day-${date.toISOString()}`} className="p-2 border text-center min-w-[120px]">
            <div className="flex flex-col items-center justify-center">
              <span className="font-medium">{format(date, 'EEEE')}</span>
              <span className="text-sm text-gray-600">{format(date, 'MMM d')}</span>
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
});

TableHeader.displayName = 'TableHeader';

export default TableHeader;
