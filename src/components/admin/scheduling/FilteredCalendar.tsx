
import React from 'react';
import { CalendarProvider } from './context/CalendarContext';
import CalendarContent from './CalendarContent';

interface FilteredCalendarProps {
  filterType?: 'role' | 'course' | 'skill' | 'teacher' | 'student';
  filterValues?: string[];
  hasAdminAccess?: boolean;
  title?: string;
}

const FilteredCalendar: React.FC<FilteredCalendarProps> = ({
  filterType,
  filterValues = [],
  hasAdminAccess = false,
  title = "Calendar"
}) => {
  // Process filter props to map to the right properties
  const filterProps = () => {
    switch(filterType) {
      case 'role':
        return { roleFilter: filterValues };
      case 'course':
        return { courseId: filterValues[0] };
      case 'skill':
        return { skillId: filterValues[0] };
      case 'teacher':
      case 'student':
        return { userId: filterValues[0] };
      default:
        return {};
    }
  };

  return (
    <CalendarProvider>
      <div className="h-full flex flex-col">
        <CalendarContent 
          hasAdminAccess={hasAdminAccess}
          title={title}
          {...filterProps()}
        />
      </div>
    </CalendarProvider>
  );
};

export default FilteredCalendar;
