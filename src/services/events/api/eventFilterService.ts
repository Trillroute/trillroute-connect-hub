
import { FilterEventsProps, FilterType } from './types/eventTypes';
import { getColumnNameFromFilterType, usesMetadataFiltering, usesDirectUserFiltering } from './utils/filterUtils';
import { 
  fetchAllEvents, 
  fetchEventsBySingleValue, 
  fetchEventsByMultipleValues,
  fetchUserEvents
} from './queries';

/**
 * Main function to fetch events based on specified filter type and IDs
 */
export async function fetchEventsByFilter(props: FilterEventsProps) {
  const { filterType, filterIds = [] } = props;
  
  try {
    console.log(`Fetching events with filter type: ${filterType || 'none'}, IDs: ${filterIds.length ? filterIds.join(',') : 'none'}`);
    
    // Handle case with no filters - return all events
    if (!filterType || filterType === null) {
      return await fetchAllEvents();
    }
    
    // Handle filtering by IDs
    if (filterIds.length === 0) {
      return await fetchAllEvents();
    }
    
    // For teacher and student filters, we need to handle both user_id and metadata filtering
    if (filterType === 'teacher' || filterType === 'student') {
      // Fetch events where the user is the owner (user_id matches)
      const userEvents = await fetchUserEvents(filterIds);
      
      // Also fetch events where they appear in metadata (for cross-user events like teacher-student classes)
      const metadataColumnName = getColumnNameFromFilterType(filterType);
      const metadataEvents = metadataColumnName ? (
        filterIds.length === 1 
          ? await fetchEventsBySingleValue(metadataColumnName, filterIds[0])
          : await fetchEventsByMultipleValues(metadataColumnName, filterIds)
      ) : [];
      
      // Combine and deduplicate events
      const allEvents = [...userEvents, ...metadataEvents];
      const uniqueEvents = allEvents.filter((event, index, self) => 
        index === self.findIndex(e => e.id === event.id)
      );
      
      console.log(`Found ${uniqueEvents.length} total events for ${filterType} filter (${userEvents.length} user events + ${metadataEvents.length} metadata events)`);
      return uniqueEvents;
    }
    
    // Map filter type to column name
    const columnName = getColumnNameFromFilterType(filterType);
    
    // If column name couldn't be determined, return all events
    if (!columnName) {
      return await fetchAllEvents();
    }
    
    // Handle direct user filtering (admin, staff)
    if (usesDirectUserFiltering(filterType)) {
      return await fetchUserEvents(filterIds);
    }
    
    // Handle metadata filtering (course, skill)
    if (usesMetadataFiltering(filterType)) {
      if (filterIds.length === 1) {
        return await fetchEventsBySingleValue(columnName, filterIds[0]);
      } else {
        return await fetchEventsByMultipleValues(columnName, filterIds);
      }
    }
    
    // Fallback to all events
    return await fetchAllEvents();
    
  } catch (error) {
    console.error('Exception fetching filtered events:', error);
    return [];
  }
}

// Re-export types and functions
export type { FilterEventsProps, FilterType } from './types/eventTypes';
export { fetchUserEvents };
