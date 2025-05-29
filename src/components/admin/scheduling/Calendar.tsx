
import React from 'react';
import { CalendarProvider } from './context/CalendarContext';
import { CalendarContent } from './CalendarContent';

interface CalendarProps {
  filterType?: 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | null;
  filterId?: string | null;
  filterIds?: string[];
  filters?: { users: string[]; courses: string[]; skills: string[] };
}

export const Calendar: React.FC<CalendarProps> = ({
  filterType,
  filterId,
  filterIds,
  filters
}) => {
  return (
    <CalendarProvider>
      <CalendarContent
        filterType={filterType}
        filterId={filterId}
        filterIds={filterIds}
        filters={filters}
      />
    </CalendarProvider>
  );
};
