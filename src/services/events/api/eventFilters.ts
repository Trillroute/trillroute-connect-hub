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
    // Break down the query to avoid type instantiation issues
    let query = supabase.from('calendar_events');
    let selectQuery = query.select('*');
    let result = await selectQuery;
    
    if (result.error) {
      console.error('Error fetching all events:', result.error);
      return [];
    }

    // Use type assertion with an explicitly declared empty array fallback
    const events = (result.data || []) as CalendarEvent[];
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
    // Break down the query to avoid type instantiation issues
    let query = supabase.from('calendar_events');
    let selectQuery = query.select('*');
    let filteredQuery = selectQuery.eq(columnName, filterId);
    let result = await filteredQuery;
    
    if (result.error) {
      console.error(`Error fetching events for ${filterType} with ID ${filterId}:`, result.error);
      return [];
    }

    // Use type assertion with an explicitly declared empty array fallback
    const events = (result.data || []) as CalendarEvent[];
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
    // Break down the query to avoid type instantiation issues
    let query = supabase.from('calendar_events');
    let selectQuery = query.select('*');
    let filteredQuery = selectQuery.in(columnName, filterIds);
    let result = await filteredQuery;
    
    if (result.error) {
      console.error(`Error fetching events for ${filterType} with multiple IDs:`, result.error);
      return [];
    }

    // Use type assertion with an explicitly declared empty array fallback
    const events = (result.data || []) as CalendarEvent[];
    console.log(`Found ${events.length} events for ${filterType}`);
    return events;
  } catch (error) {
    console.error(`Unexpected error in fetchEventsByMultipleValues:`, error);
    return [];
  }
}

/**
 * Fetch events for a specific user
 */
export const fetchUserEvents = async (userId: string): Promise<CalendarEvent[]> => {
  try {
    const { data, error } = await supabase
      .from('user_events')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching user events:', error);
      return [];
    }
    
    // Explicitly cast to any before mapping to avoid deep type instantiation
    const events = (data || []) as any[];
    
    // Map to calendar events with explicit typing
    return events.map((event): CalendarEvent => ({
      id: event.id,
      title: event.title,
      start: new Date(event.start_time),
      end: new Date(event.end_time),
      description: event.description || '',
      eventType: event.event_type,
      userId: event.user_id,
      metadata: event.metadata || {}
    }));
  } catch (error) {
    console.error('Error in fetchUserEvents:', error);
    return [];
  }
};
