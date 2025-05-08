
import React from 'react';
import { CalendarProvider } from './context/CalendarContext';
import CalendarContent from './CalendarContent';
import { FilteredEventsProvider } from './view-components/FilteredEventsProvider';

interface FilteredCalendarProps {
  filterType?: 'role' | 'course' | 'skill' | 'teacher' | 'student';
  filterValues?: string[];
  hasAdminAccess?: boolean;
  title?: string;
  description?: string;
}

const FilteredCalendar: React.FC<FilteredCalendarProps> = ({
  filterType,
  filterValues = [],
  hasAdminAccess = false,
  title = "Calendar",
  description
}) => {
  // Process filter props to map to the right properties
  const mapFilterTypeToProvider = () => {
    switch(filterType) {
      case 'role':
        return { filterType: 'staff', filterIds: filterValues };
      case 'course':
        return { filterType: 'course', filterIds: filterValues };
      case 'skill':
        return { filterType: 'skill', filterIds: filterValues };
      case 'teacher':
        return { filterType: 'teacher', filterIds: filterValues };
      case 'student':
        return { filterType: 'student', filterIds: filterValues };
      default:
        return { filterType: null, filterIds: [] };
    }
  };

  const providerProps = mapFilterTypeToProvider();
  
  console.log("Rendering FilteredCalendar with:", { filterType, filterValues, hasAdminAccess, title, providerProps });

  return (
    <CalendarProvider>
      <FilteredEventsProvider 
        filterType={providerProps.filterType}
        filterIds={providerProps.filterIds}
      >
        <div className="h-full flex flex-col">
          <CalendarContent 
            hasAdminAccess={hasAdminAccess}
            title={title}
            description={description}
          />
        </div>
      </FilteredEventsProvider>
    </CalendarProvider>
  );
};

export default FilteredCalendar;
