
import { CalendarEvent, FilterEventsProps, FilterType } from './types/eventTypes';
import { getColumnNameFromFilterType } from './utils/filterUtils';
import { 
  fetchAllEvents, 
  fetchEventsBySingleValue, 
  fetchEventsByMultipleValues,
  fetchUserEvents
} from './queries';

/**
 * Main function to fetch events based on specified filter type and IDs
 */
export async function fetchEventsByFilter(props: FilterEventsProps): Promise<CalendarEvent[]> {
  const { filterType, filterIds = [] } = props;
  
  try {
    console.log(`Fetching events with filter type: ${filterType || 'none'}, IDs: ${filterIds.length ? filterIds.join(',') : 'none'}`);
    
    // Handle case with no filters - return all events
    if (!filterType || filterType === null) {
      return await fetchAllEvents();
    }
    
    // Map filter type to column name
    const columnName = getColumnNameFromFilterType(filterType);
    
    // If column name couldn't be determined, return all events
    if (!columnName) {
      return await fetchAllEvents();
    }
    
    // Handle filtering by IDs
    if (filterIds.length === 0) {
      return await fetchAllEvents();
    } else if (filterIds.length === 1) {
      return await fetchEventsBySingleValue(columnName, filterType, filterIds[0]);
    } else {
      return await fetchEventsByMultipleValues(columnName, filterType, filterIds);
    }
    
  } catch (error) {
    console.error('Exception fetching filtered events:', error);
    return [];
  }
}

// Re-export types and functions
export type { CalendarEvent, FilterType, FilterEventsProps } from './types/eventTypes';
export { fetchUserEvents };
