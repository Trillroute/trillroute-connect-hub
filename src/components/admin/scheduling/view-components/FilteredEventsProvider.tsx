
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
  const { setEvents, setAvailabilities } = useCalendar();
  
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
    const staffUserIds: string[] = [];
    
    // Combine filterId and filterIds
    const allIds: string[] = [];
    if (filterId) allIds.push(filterId);
    if (filterIds && Array.isArray(filterIds)) allIds.push(...filterIds);
    
    // Log filter application
    console.log(`FilteredEventsProvider applying ${filterType} filter with IDs:`, allIds);
    
    // Apply the filter
    applyFilter({
      filterType,
      ids: allIds,
      staffUserIds,
      setEvents,
      setAvailabilities,
      convertAvailabilityMap
    });
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType, filterId, JSON.stringify(filterIds), setEvents, setAvailabilities]);

  // Return children without additional wrapping
  return <>{children}</>;
};
