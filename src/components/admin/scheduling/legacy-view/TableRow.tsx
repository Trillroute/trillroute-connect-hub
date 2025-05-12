
import React from 'react';
import TableCell from './TableCell';
import { CellInfo } from './useCellInfo';

interface Day {
  name: string;
  date: Date;
  dayOfWeek: number;
}

interface TableRowProps {
  day: Day;
  timeSlots: string[];
  getCellInfo: (day: Day, timeSlot: string) => CellInfo[];
}

const TableRow: React.FC<TableRowProps> = ({ day, timeSlots, getCellInfo }) => {
  // Helper to check if a time has passed
  const isTimeExpired = (timeSlot: string): boolean => {
    const now = new Date();
    const slotDate = new Date(day.date);
    const [hours, minutes] = timeSlot.split(':').map(Number);
    slotDate.setHours(hours, minutes || 0, 0, 0);
    return slotDate < now;
  };

  return (
    <tr className="border-b">
      <td className="p-2 border bg-gray-100">
        <div>
          {day.name}
        </div>
        <div className="text-xs text-gray-500">
          {day.date.toLocaleDateString()}
        </div>
      </td>
      
      {timeSlots.map((timeSlot, slotIndex) => {
        const cellInfos = getCellInfo(day, timeSlot);
        const isExpired = isTimeExpired(timeSlot);
        
        return (
          <TableCell
            key={`${day.dayOfWeek}-${slotIndex}`}
            timeSlot={timeSlot}
            cellInfos={cellInfos}
            isExpired={isExpired}
          />
        );
      })}
    </tr>
  );
};

export default TableRow;
