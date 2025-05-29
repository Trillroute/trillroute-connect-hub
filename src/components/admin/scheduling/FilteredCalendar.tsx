
import React from 'react';
import { Calendar } from './Calendar';
import { FilteredEventsProvider } from './view-components/FilteredEventsProvider';

interface FilteredCalendarProps {
  filterType?: 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | null;
  filterId?: string | null;
  filterIds?: string[];
  filters?: { users: string[]; courses: string[]; skills: string[] };
}

export const FilteredCalendar: React.FC<FilteredCalendarProps> = ({
  filterType,
  filterId,
  filterIds,
  filters
}) => {
  return (
    <FilteredEventsProvider
      filterType={filterType}
      filterId={filterId}
      filterIds={filterIds}
    >
      <Calendar
        filterType={filterType}
        filterId={filterId}
        filterIds={filterIds}
        filters={filters}
      />
    </FilteredEventsProvider>
  );
};
