
import React, { useEffect } from 'react';
import { useCalendar } from '../context/CalendarContext';
import { applyFilter } from '../utils/filterUtils';
import { UserAvailabilityMap as ServiceUserAvailabilityMap } from '@/services/availability/types';
import { UserAvailabilityMap as ContextUserAvailabilityMap } from '../context/calendarTypes';

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
  // Check if we have calendar context available
  let calendarContext;
  try {
    calendarContext = useCalendar();
  } catch (error) {
    console.warn('FilteredEventsProvider: No CalendarContext available, using as passthrough');
    return <>{children}</>;
  }

  const { setEvents, setAvailabilities, refreshEvents } = calendarContext;
  
  // Convert service availability map to context availability map
  const convertAvailabilityMap = (
    serviceMap: ServiceUserAvailabilityMap
  ): ContextUserAvailabilityMap => {
    const result: ContextUserAvailabilityMap = {};
    
    Object.entries(serviceMap).forEach(([userId, userData]) => {
      result[userId] = {
        slots: userData.slots.map(slot => ({
          id: slot.id,
          user_id: slot.user_id,
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
          category: slot.category || 'Default'
        })),
        name: userData.name,
        role: userData.role
      };
    });
    
    return result;
  };

  // Apply filters when filterType or filterIds change
  useEffect(() => {
    console.log('FilteredEventsProvider: Effect triggered with:', { filterType, filterIds, filterId });
    
    // Combine filterId and filterIds into a single array
    const allFilterIds = [...filterIds];
    if (filterId && !allFilterIds.includes(filterId)) {
      allFilterIds.push(filterId);
    }
    
    // Apply the filter using the filterUtils
    applyFilter({
      filterType,
      ids: allFilterIds,
      setEvents,
      setAvailabilities,
      convertAvailabilityMap,
      refreshEvents
    });
    
  }, [filterType, filterId, JSON.stringify(filterIds), setEvents, setAvailabilities, refreshEvents]);

  // Return children without additional wrapping
  return <>{children}</>;
};
