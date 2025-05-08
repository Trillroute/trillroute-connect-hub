
import React from 'react';
import { CalendarProvider } from './context/CalendarContext';
import CalendarContent from './CalendarContent';
import { FilteredEventsProvider } from './view-components/FilteredEventsProvider';

interface FilteredCalendarProps {
  filterType?: 'role' | 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff';
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
    // Ensure filterValues is always an array
    const safeFilterValues = Array.isArray(filterValues) ? filterValues : [];
    
    switch(filterType) {
      case 'role':
        return { filterType: 'staff' as const, filterIds: safeFilterValues };
      case 'course':
        return { filterType: 'course' as const, filterIds: safeFilterValues };
      case 'skill':
        return { filterType: 'skill' as const, filterIds: safeFilterValues };
      case 'teacher':
        return { filterType: 'teacher' as const, filterIds: safeFilterValues };
      case 'student':
        return { filterType: 'student' as const, filterIds: safeFilterValues };
      case 'staff':
        return { filterType: 'staff' as const, filterIds: safeFilterValues };
      case 'admin':
        return { filterType: 'admin' as const, filterIds: safeFilterValues };
      default:
        return { filterType: null, filterIds: [] };
    }
  };

  const providerProps = mapFilterTypeToProvider();
  
  console.log('FilteredCalendar props:', { filterType, filterValues, providerProps });
  
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
            initialFilterType={filterType || null}
          />
        </div>
      </FilteredEventsProvider>
    </CalendarProvider>
  );
};

export default FilteredCalendar;
