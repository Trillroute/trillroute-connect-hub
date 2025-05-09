
import React from 'react';
import { useFilteredEvents } from '../hooks/useFilteredEvents';

interface FilteredEventsProviderProps {
  children: React.ReactNode;
  filterType?: 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | 'unit' | null;
  filterId?: string | null;
  filterIds?: string[];
}

/**
 * Component that handles filtering events based on provided filter parameters
 */
export const FilteredEventsProvider: React.FC<FilteredEventsProviderProps> = ({
  children,
  filterType,
  filterId,
  filterIds = []
}) => {
  // Use the extracted hook to handle all the filtering logic
  useFilteredEvents({ filterType, filterId, filterIds });

  // Simply render children since all the state is handled through the Calendar context
  return <>{children}</>;
};

export default FilteredEventsProvider;
