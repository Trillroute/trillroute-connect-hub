
import React from 'react';
import { useFilteredEvents } from '../hooks/useFilteredEvents';

interface FilteredEventsProviderProps {
  children: React.ReactNode;
  filterType?: 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | null;
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
  // Use our custom hook to handle all the filtering logic
  // We don't need to store the result as we're updating the context state directly
  useFilteredEvents({
    filterType,
    filterId,
    filterIds
  });

  return <>{children}</>;
};
