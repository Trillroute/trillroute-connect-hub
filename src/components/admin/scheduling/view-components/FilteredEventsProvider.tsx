
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
    
    // If no filters are applied, use refreshEvents to get all events
    if ((!filterType || filterType === null) && (!filterIds || filterIds.length === 0) && !filterId) {
      console.log("FilteredEventsProvider: No filters applied, fetching all events");
      refreshEvents();
      return;
    }
    
    // Define default roles based on filterType
    let defaultRoles: string[] = [];
    
    // Set appropriate default roles for each filter type when no specific IDs are selected
    if ((filterIds && filterIds.length === 0) || !filterIds) {
      switch(filterType) {
        case 'teacher':
          defaultRoles = ['teacher'];
          break;
        case 'admin':
          defaultRoles = ['admin', 'superadmin'];
          break;
        case 'staff':
          defaultRoles = ['teacher', 'admin', 'superadmin'];
          break;
        default:
          defaultRoles = [];
      }
    }
    
    // Combine filterId and filterIds
    const allIds: string[] = [];
    if (filterId) allIds.push(filterId);
    if (filterIds && Array.isArray(filterIds)) allIds.push(...filterIds);
    
    // Log filter application with more detail
    console.log(`==== FILTERED EVENTS PROVIDER ====`);
    console.log(`Applying ${filterType || 'null'} filter with ${allIds.length} IDs and default roles:`, defaultRoles);
    
    // Apply the filter
    applyFilter({
      filterType,
      ids: allIds,
      defaultRoles,
      setEvents,
      setAvailabilities,
      convertAvailabilityMap,
      refreshEvents
    });
    
  }, [filterType, filterId, JSON.stringify(filterIds), setEvents, setAvailabilities, refreshEvents]);

  // Return children without additional wrapping
  return <>{children}</>;
};
