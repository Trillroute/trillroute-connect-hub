
import React from 'react';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import { CalendarEvent, UserAvailabilityMap } from '../context/calendarTypes';

interface LegacyViewTableProps {
  events: CalendarEvent[];
  availabilities: UserAvailabilityMap;
  timeSlots: string[];
  daysOfWeek: Date[];
}

const LegacyViewTable: React.FC<LegacyViewTableProps> = ({ 
  events,
  availabilities,
  timeSlots,
  daysOfWeek
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <TableHeader daysOfWeek={daysOfWeek} />
        <tbody>
          {timeSlots.map((timeSlot, index) => (
            <TableRow 
              key={`timeslot-${timeSlot}`}
              timeSlot={timeSlot}
              daysOfWeek={daysOfWeek}
              events={events}
              availabilities={availabilities}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LegacyViewTable;
