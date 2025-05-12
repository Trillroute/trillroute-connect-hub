
import React from 'react';
import { ChevronDown } from 'lucide-react';
import TableCell from './TableCell';
import { formatTimeDisplay } from './legacyViewUtils';

interface Day {
  name: string;
  date: Date;
  dayOfWeek: number;
}

interface TableRowProps {
  day: Day;
  timeSlots: string[];
  getCellInfo: (day: Day, timeSlot: string) => any;
}

const TableRow: React.FC<TableRowProps> = ({ day, timeSlots, getCellInfo }) => {
  return (
    <tr className="border-b">
      <td className="p-2 border bg-gray-100">
        <div className="flex items-center gap-2">
          <ChevronDown className="h-4 w-4" />
          {day.name}
        </div>
        <div className="text-xs text-gray-500">
          {/* Placeholder for number of events/slots */}
          9
        </div>
      </td>
      
      {timeSlots.map((timeSlot, slotIndex) => {
        const cellInfo = getCellInfo(day, timeSlot);
        const isExpired = false; // Logic to determine if slot is expired
        
        return (
          <TableCell
            key={`${day.dayOfWeek}-${slotIndex}`}
            timeSlot={timeSlot}
            cellInfo={cellInfo}
            isExpired={isExpired}
          />
        );
      })}
    </tr>
  );
};

export default TableRow;
