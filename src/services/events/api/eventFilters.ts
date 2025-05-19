
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

// Define a simple response type to avoid complex type inference
type SupabaseQueryResult = {
  data: any;
  error: any;
};

/**
 * Main function to fetch events based on specified filter type and IDs
 */
export async function fetchEventsByFilter(props: FilterEventsProps): Promise<CalendarEvent[]> {
  const { filterType, filterIds = [] } = props;
  
  try {
    console.log(`Fetching events with filter type: ${filterType || 'none'}, IDs: ${filterIds.length ? filterIds.join(',') : 'none'}`);
    
    // Handle case with no filters
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
  // Use a type assertion to circumvent the deep instantiation
  const result = await supabase
    .from('calendar_events')
    .select('*') as SupabaseQueryResult;
  
  if (result.error) {
    console.error('Error fetching all events:', result.error);
    return [];
  }
  
  console.log(`Found ${result.data?.length || 0} events (no filters)`);
  return (result.data || []) as CalendarEvent[];
}

/**
 * Fetch events matching a single value in the specified column
 */
async function fetchEventsBySingleValue(
  columnName: string, 
  filterType: FilterType, 
  filterId: string
): Promise<CalendarEvent[]> {
  // Use a type assertion to circumvent the deep instantiation
  const result = await supabase
    .from('calendar_events')
    .select('*')
    .eq(columnName, filterId) as SupabaseQueryResult;
  
  if (result.error) {
    console.error(`Error fetching events for ${filterType} with ID ${filterId}:`, result.error);
    return [];
  }
  
  console.log(`Found ${result.data?.length || 0} events for ${filterType} with ID ${filterId}`);
  return (result.data || []) as CalendarEvent[];
}

/**
 * Fetch events matching multiple values in the specified column
 */
async function fetchEventsByMultipleValues(
  columnName: string, 
  filterType: FilterType, 
  filterIds: string[]
): Promise<CalendarEvent[]> {
  // Use a type assertion to circumvent the deep instantiation
  const result = await supabase
    .from('calendar_events')
    .select('*')
    .in(columnName, filterIds) as SupabaseQueryResult;
  
  if (result.error) {
    console.error(`Error fetching events for ${filterType} with multiple IDs:`, result.error);
    return [];
  }
  
  console.log(`Found ${result.data?.length || 0} events for ${filterType}`);
  return (result.data || []) as CalendarEvent[];
}
