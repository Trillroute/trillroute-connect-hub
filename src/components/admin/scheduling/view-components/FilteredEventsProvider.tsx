
import React, { useEffect } from 'react';
import { useCalendar } from '../context/CalendarContext';
import { applyFilter, convertAvailabilityMap } from '../utils/filters';
import { UserAvailabilityMap as ServiceUserAvailabilityMap } from '@/services/availability/types';
import { UserAvailabilityMap as ContextUserAvailabilityMap } from '../context/calendarTypes';
import { toast } from '@/components/ui/use-toast';

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

  // Apply filters when filterType or filterIds change
  useEffect(() => {
    const staffUserIds: string[] = [];
    
    // Combine filterId and filterIds
    const allIds: string[] = [];
    if (filterId) allIds.push(filterId);
    if (filterIds && Array.isArray(filterIds)) allIds.push(...filterIds);
    
    // Log filter application with more detail
    console.log(`==== FILTERED EVENTS PROVIDER ====`);
    console.log(`Applying ${filterType || 'null'} filter with ${allIds.length} IDs:`, allIds);
    
    // We've had issues with skill filtering, add extra debug info
    if (filterType === 'skill') {
      console.log('Skill filter active with the following IDs:', allIds);
      
      if (allIds.length === 0) {
        toast({
          title: "No skill selected",
          description: "Please select a skill to filter by.",
        });
      }
    }
    
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
