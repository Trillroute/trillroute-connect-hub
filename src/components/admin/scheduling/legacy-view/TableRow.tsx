
import React, { memo } from 'react';
import TableCell from './TableCell';
import { useCellInfo } from './useCellInfo';
import { isTimeSlotExpired } from './legacyViewUtils';
import { CalendarEvent, UserAvailabilityMap } from '../context/calendarTypes';

interface TableRowProps {
  timeSlot: string;
  daysOfWeek: Date[];
  events: CalendarEvent[];
  availabilities: UserAvailabilityMap;
}

const TableRow: React.FC<TableRowProps> = memo(({ timeSlot, daysOfWeek, events, availabilities }) => {
  // Get cell info for each day
  const { getCellInfo } = useCellInfo(events, availabilities);

  return (
    <tr>
      {/* Time slot column */}
      <td className="px-2 py-1 border bg-gray-100 font-medium text-sm w-20 text-center">
        {timeSlot}
      </td>
      
      {/* Each day's cell */}
      {daysOfWeek.map((date) => {
        const cellInfos = getCellInfo(date, timeSlot);
        const isExpired = isTimeSlotExpired(timeSlot, date);
        
        return (
          <TableCell 
            key={`cell-${date.toISOString()}-${timeSlot}`}
            timeSlot={timeSlot} 
            cellInfos={cellInfos}
            isExpired={isExpired}
            date={date}
          />
        );
      })}
    </tr>
  );
});

TableRow.displayName = 'TableRow';

export default TableRow;
