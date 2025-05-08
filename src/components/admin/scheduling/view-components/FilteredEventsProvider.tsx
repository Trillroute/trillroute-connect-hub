
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
    if (!filterType) {
      refreshEvents();
      return;
    }

    // Apply the appropriate filter
    const applyFilter = async () => {
      // Make sure filterIds is a valid array
      const safeFilterIds = Array.isArray(filterIds) ? filterIds : [];
      
      // If we have both filterIds array and a single filterId, combine them safely
      const combinedIds: string[] = [];
      
      // Add filterId if it's a valid string
      if (filterId && typeof filterId === 'string') {
        combinedIds.push(filterId);
      }
      
      // Add all valid items from safeFilterIds
      for (let i = 0; i < safeFilterIds.length; i++) {
        const id = safeFilterIds[i];
        if (id && typeof id === 'string') {
          combinedIds.push(id);
        }
      }
      
      // Filter out any duplicate IDs
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
