
import React, { useEffect } from 'react';
import { useCalendar } from '../context/CalendarContext';

interface FilteredEventsProviderProps {
  children: React.ReactNode;
  filterType?: 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | null;
  filterId?: string | null;
}

/**
 * Component that handles filtering events based on provided filter parameters
 */
export const FilteredEventsProvider: React.FC<FilteredEventsProviderProps> = ({
  children,
  filterType,
  filterId
}) => {
  const { refreshEvents, setEvents } = useCalendar();
  
  // Apply filters when filter type or ID changes
  useEffect(() => {
    if (!filterType) {
      refreshEvents();
      return;
    }

    // Import and use the event filtering utility
    const { fetchFilteredEvents } = require('../utils/eventProcessing');
    
    // Apply the appropriate filter
    const applyFilter = async () => {
      switch (filterType) {
        case 'course':
          await fetchFilteredEvents({ courseId: filterId, setEvents });
          break;
        case 'skill':
          await fetchFilteredEvents({ skillId: filterId, setEvents });
          break;
        case 'teacher':
          await fetchFilteredEvents({ 
            roleFilter: ['teacher'],
            userId: filterId,
            setEvents 
          });
          break;
        case 'student':
          await fetchFilteredEvents({ 
            roleFilter: ['student'],
            userId: filterId,
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
  }, [filterType, filterId, refreshEvents, setEvents]);

  return <>{children}</>;
};
