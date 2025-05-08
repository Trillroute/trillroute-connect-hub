
import React, { useEffect } from 'react';
import { useCalendar } from '../context/CalendarContext';
import { fetchFilteredEvents } from '../utils/eventProcessing';

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
  const { refreshEvents, setEvents } = useCalendar();
  
  // Apply filters when filter type or IDs change
  useEffect(() => {
    console.log('FilteredEventsProvider: Effect triggered', { filterType, filterId, filterIds });
    
    if (!filterType) {
      console.log('No filter type specified, refreshing events');
      refreshEvents();
      return;
    }

    // Apply the appropriate filter
    const applyFilter = async () => {
      // Ensure filterIds is a valid array
      const safeFilterIds = Array.isArray(filterIds) ? filterIds : [];
      
      // Combine filterId and filterIds safely
      const combinedIds: string[] = [];
      
      // Add filterId if it's valid
      if (filterId && typeof filterId === 'string') {
        combinedIds.push(filterId);
      }
      
      // Add all valid items from safeFilterIds
      safeFilterIds.forEach(id => {
        if (id && typeof id === 'string') {
          combinedIds.push(id);
        }
      });
      
      // Filter out duplicates
      const uniqueIds = [...new Set(combinedIds)];
      
      console.log(`Applying ${filterType} filter with IDs:`, uniqueIds);
      
      switch (filterType) {
        case 'course':
          await fetchFilteredEvents({ courseIds: uniqueIds, setEvents });
          break;
        case 'skill':
          await fetchFilteredEvents({ skillIds: uniqueIds, setEvents });
          break;
        case 'teacher':
          await fetchFilteredEvents({ 
            roleFilter: ['teacher'],
            userIds: uniqueIds,
            setEvents 
          });
          break;
        case 'student':
          await fetchFilteredEvents({ 
            roleFilter: ['student'],
            userIds: uniqueIds,
            setEvents 
          });
          break;
        case 'admin':
          await fetchFilteredEvents({ 
            roleFilter: ['admin'], 
            setEvents 
          });
          break;
        case 'staff':
          await fetchFilteredEvents({ 
            roleFilter: ['teacher', 'admin', 'superadmin'], 
            setEvents 
          });
          break;
        default:
          refreshEvents();
      }
    };

    applyFilter();
  }, [filterType, filterId, filterIds, refreshEvents, setEvents]);

  return <>{children}</>;
};
