
import { supabase } from '@/integrations/supabase/client';

/**
 * Filter types supported for event filtering
 */
export type FilterType = 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | null;

/**
 * Props for filtering events
 */
interface FilterEventsProps {
  filterType: FilterType;
  filterIds?: string[];
}

/**
 * Calendar event interface for typing the returned data
 */
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  user_id: string;
  location?: string;
  color?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Main function to fetch events based on specified filter type and IDs
 */
export async function fetchEventsByFilter(props: FilterEventsProps): Promise<CalendarEvent[]> {
  const { filterType, filterIds = [] } = props;
  
  try {
    console.log(`Fetching events with filter type: ${filterType || 'none'}, IDs: ${filterIds.length ? filterIds.join(',') : 'none'}`);
    
    // Handle case with no filters - return all events
    if (!filterType || filterIds.length === 0) {
      return await fetchAllEvents();
    }
    
    // Map filter type to column name
    const columnName = getColumnNameFromFilterType(filterType);
    
    // If column name couldn't be determined, return all events
    if (!columnName) {
      return await fetchAllEvents();
    }
    
    // Handle filtering by IDs
    if (filterIds.length === 1) {
      return await fetchEventsBySingleValue(columnName, filterType, filterIds[0]);
    } else {
      return await fetchEventsByMultipleValues(columnName, filterType, filterIds);
    }
    
  } catch (error) {
    console.error('Exception fetching filtered events:', error);
    return [];
  }
}

/**
 * Map filter type to the corresponding column name for database queries
 */
function getColumnNameFromFilterType(filterType: FilterType): string | null {
  switch (filterType) {
    case 'course':
      return 'course_id';
    case 'skill':
      return 'skill_id';
    case 'teacher':
    case 'student':
    case 'admin':
    case 'staff':
      return 'user_id';
    default:
      return null;
  }
}

/**
 * Fetch all calendar events with no filtering
 */
async function fetchAllEvents(): Promise<CalendarEvent[]> {
  try {
    // Break type checking chain by using separate execution steps
    const query = supabase.from("calendar_events").select("*");
    
    // Execute query separately from its definition
    const response = await query;
    
    if (response.error) {
      console.error('Error fetching all events:', response.error);
      return [];
    }

    // Safely cast to CalendarEvent array
    const events = Array.isArray(response.data) ? response.data as CalendarEvent[] : [];
    console.log(`Found ${events.length} events (no filters)`);
    return events;
  } catch (error) {
    console.error('Unexpected error in fetchAllEvents:', error);
    return [];
  }
}

/**
 * Fetch events matching a single value in the specified column
 */
async function fetchEventsBySingleValue(
  columnName: string, 
  filterType: FilterType, 
  filterId: string
): Promise<CalendarEvent[]> {
  try {
    // Break type checking chain completely by separating into simple steps
    // Step 1: Create the base query object without type checking
    const baseQuery = supabase.from("calendar_events");
    
    // Step 2: Add the select method
    const selectQuery = baseQuery.select("*");
    
    // Step 3: Add the filter condition
    const finalQuery = selectQuery.eq(columnName, filterId);
    
    // Step 4: Execute the query separately
    const response = await finalQuery;
      
    if (response.error) {
      console.error(`Error fetching events for ${filterType} with ID ${filterId}:`, response.error);
      return [];
    }

    // Safely cast to CalendarEvent array
    const events = Array.isArray(response.data) ? response.data as CalendarEvent[] : [];
    console.log(`Found ${events.length} events for ${filterType} with ID ${filterId}`);
    return events;
  } catch (error) {
    console.error(`Unexpected error in fetchEventsBySingleValue:`, error);
    return [];
  }
}

/**
 * Fetch events matching multiple values in the specified column
 */
async function fetchEventsByMultipleValues(
  columnName: string, 
  filterType: FilterType, 
  filterIds: string[]
): Promise<CalendarEvent[]> {
  try {
    // Break type checking chain completely by separating into simple steps
    // Step 1: Create the base query object without type checking
    const baseQuery = supabase.from("calendar_events");
    
    // Step 2: Add the select method
    const selectQuery = baseQuery.select("*");
    
    // Step 3: Add the filter condition
    const finalQuery = selectQuery.in(columnName, filterIds);
    
    // Step 4: Execute the query separately
    const response = await finalQuery;
      
    if (response.error) {
      console.error(`Error fetching events for ${filterType} with multiple IDs:`, response.error);
      return [];
    }

    // Safely cast to CalendarEvent array
    const events = Array.isArray(response.data) ? response.data as CalendarEvent[] : [];
    console.log(`Found ${events.length} events for ${filterType}`);
    return events;
  } catch (error) {
    console.error(`Unexpected error in fetchEventsByMultipleValues:`, error);
    return [];
  }
}
