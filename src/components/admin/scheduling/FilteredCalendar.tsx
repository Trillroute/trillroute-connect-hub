
import React from 'react';
import { CalendarProvider } from './context/CalendarContext';
import CalendarContent from './CalendarContent';

interface FilteredCalendarProps {
  title: string;
  description?: string;
  filterType?: 'role' | 'course' | 'user' | 'skill';
  filterValues?: string[];
  userIds?: string[];
  hasAdminAccess?: boolean;
}

const FilteredCalendar: React.FC<FilteredCalendarProps> = ({ 
  title,
  description,
  filterType,
  filterValues = [],
  userIds = [],
  hasAdminAccess = false,
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="border-b pb-4 mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        {description && <p className="text-gray-500 mt-1">{description}</p>}
      </div>
      <div className="flex-1 border rounded-md bg-white overflow-hidden">
        <CalendarProvider>
          <CalendarContent 
            hasAdminAccess={hasAdminAccess} 
            userId={userIds.length === 1 ? userIds[0] : undefined}
            userIds={userIds.length > 1 ? userIds : undefined}
            roleFilter={filterType === 'role' ? filterValues : undefined}
            courseId={filterType === 'course' ? filterValues[0] : undefined}
            skillId={filterType === 'skill' ? filterValues[0] : undefined}
          />
        </CalendarProvider>
      </div>
    </div>
  );
};

export default FilteredCalendar;
