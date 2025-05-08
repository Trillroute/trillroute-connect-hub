
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
      // Make sure filterIds is an array before checking its length
      const safeFilterIds = Array.isArray(filterIds) ? filterIds : [];
      const ids = safeFilterIds.length > 0 ? safeFilterIds : (filterId ? [filterId] : []);
      
      switch (filterType) {
        case 'course':
          await fetchFilteredEvents({ courseIds: ids, setEvents });
          break;
        case 'skill':
          await fetchFilteredEvents({ skillIds: ids, setEvents });
          break;
        case 'teacher':
          await fetchFilteredEvents({ 
            roleFilter: ['teacher'],
            userIds: ids,
            setEvents 
          });
          break;
        case 'student':
          await fetchFilteredEvents({ 
            roleFilter: ['student'],
            userIds: ids,
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
