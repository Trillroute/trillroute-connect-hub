
import React from 'react';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import { useCellInfo } from './useCellInfo';
import { CalendarEvent, UserAvailabilityMap } from '../context/calendarTypes';

interface LegacyViewTableProps {
  events: CalendarEvent[];
  availabilities: UserAvailabilityMap;
  timeSlots: string[];
  daysOfWeek: { name: string; date: Date; dayOfWeek: number }[];
}

const LegacyViewTable: React.FC<LegacyViewTableProps> = ({ 
  events, 
  availabilities, 
  timeSlots, 
  daysOfWeek 
}) => {
  const { getCellInfo } = useCellInfo(events, availabilities);

  return (
    <table className="w-full min-w-[800px] border-collapse">
      <TableHeader timeSlots={timeSlots} />
      <tbody>
        {daysOfWeek.map((day, dayIndex) => (
          <TableRow 
            key={dayIndex} 
            day={day}
            timeSlots={timeSlots}
            getCellInfo={getCellInfo}
          />
        ))}
      </tbody>
    </table>
  );
};

export default LegacyViewTable;
