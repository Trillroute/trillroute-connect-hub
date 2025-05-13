
import React, { memo } from 'react';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import { CalendarEvent, UserAvailabilityMap } from '../context/calendarTypes';
import { Table } from '@/components/ui/table';

interface LegacyViewTableProps {
  events: CalendarEvent[];
  availabilities: UserAvailabilityMap;
  timeSlots: string[];
  daysOfWeek: Date[];
}

const LegacyViewTable: React.FC<LegacyViewTableProps> = memo(({ 
  events,
  availabilities,
  timeSlots,
  daysOfWeek
}) => {
  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full border-collapse">
        <TableHeader daysOfWeek={daysOfWeek} />
        <tbody>
          {timeSlots.map((timeSlot) => (
            <TableRow 
              key={`timeslot-${timeSlot}`}
              timeSlot={timeSlot}
              daysOfWeek={daysOfWeek}
              events={events}
              availabilities={availabilities}
            />
          ))}
        </tbody>
      </Table>
    </div>
  );
});

LegacyViewTable.displayName = 'LegacyViewTable';

export default LegacyViewTable;
