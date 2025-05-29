
import { useMemo, useEffect, useState } from 'react';
import { UserAvailabilityMap } from '@/services/availability/types';
import { filterEvents } from './utils/eventFilterUtils';
import { convertAvailabilityMapToArray, filterAvailability } from './utils/availabilityUtils';
import { CalendarEvent, CalendarUserAvailability, FilterState, UseFilteredEventsProps } from './types/filterTypes';

/**
 * Custom hook to filter calendar events and availabilities based on filter criteria
 */
export function useFilteredEvents({ 
  events = [], 
  filters = { users: [], courses: [], skills: [] }, 
  availabilities,
  filterType,
  filterId,
  filterIds = []
}: UseFilteredEventsProps) {
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);
  const [filteredAvailability, setFilteredAvailability] = useState<CalendarUserAvailability[]>([]);

  // Convert availability map to array for filtering and compatibility with calendar
  const availabilityArray = useMemo(() => {
    console.log('Converting availability map to array...');
    const converted = convertAvailabilityMapToArray(availabilities as UserAvailabilityMap);
    console.log(`Converted ${converted.length} availability slots from map`);
    return converted;
  }, [availabilities]);

  // Filter events whenever filters or events change
  useEffect(() => {
    console.log('useFilteredEvents: Filtering events...');
    console.log('- filterType:', filterType);
    console.log('- filterId:', filterId);
    console.log('- filterIds:', filterIds);
    console.log('- filters:', filters);
    
    // Create a combined filter from both the filters prop and the filterType/filterId props
    const combinedFilter = { ...filters };
    
    // Add filterIds to the appropriate filter category
    if (filterType === 'teacher' || filterType === 'student' || filterType === 'admin' || filterType === 'staff') {
      combinedFilter.users = [...(combinedFilter.users || [])];
      if (filterId) combinedFilter.users.push(filterId);
      if (filterIds && filterIds.length > 0) combinedFilter.users.push(...filterIds);
    } else if (filterType === 'course') {
      combinedFilter.courses = [...(combinedFilter.courses || [])];
      if (filterId) combinedFilter.courses.push(filterId);
      if (filterIds && filterIds.length > 0) combinedFilter.courses.push(...filterIds);
    } else if (filterType === 'skill') {
      combinedFilter.skills = [...(combinedFilter.skills || [])];
      if (filterId) combinedFilter.skills.push(filterId);
      if (filterIds && filterIds.length > 0) combinedFilter.skills.push(...filterIds);
      console.log('Added skill filters:', combinedFilter.skills);
    }
    
    const { filteredEvents: newFilteredEvents } = filterEvents(events, combinedFilter);
    console.log(`Filtered events: ${newFilteredEvents.length} out of ${events.length}`);
    setFilteredEvents(newFilteredEvents);
  }, [events, filters, filterType, filterId, filterIds]);

  // Filter availabilities whenever filters or availabilities change
  useEffect(() => {
    console.log('useFilteredEvents: Filtering availability...');
    console.log('- availabilityArray length:', availabilityArray.length);
    console.log('- filterType:', filterType);
    console.log('- filterIds:', filterIds);
    console.log('- filters:', filters);
    
    const filteredAvailabilitySlots = filterAvailability(
      availabilityArray,
      filters, 
      filterType, 
      filterIds
    );
    console.log(`Filtered availability: ${filteredAvailabilitySlots.length} out of ${availabilityArray.length}`);
    setFilteredAvailability(filteredAvailabilitySlots);
  }, [availabilityArray, filters, filterType, filterIds]);

  console.log('useFilteredEvents returning:', {
    filteredEvents: filteredEvents.length,
    filteredAvailability: filteredAvailability.length
  });

  return {
    filteredEvents,
    filteredAvailability
  };
}
