
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

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
    // Explicitly type the response to avoid deep instantiation issues
    const response = await supabase.from('calendar_events').select('*');
    
    if (response.error) {
      console.error('Error fetching all events:', response.error);
      return [];
    }

    // Use type assertion with an explicitly declared empty array fallback
    const events = (response.data || []) as CalendarEvent[];
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
    // Explicitly type the response to avoid deep instantiation issues
    const response = await supabase
      .from('calendar_events')
      .select('*')
      .eq(columnName, filterId);
    
    if (response.error) {
      console.error(`Error fetching events for ${filterType} with ID ${filterId}:`, response.error);
      return [];
    }

    // Use type assertion with an explicitly declared empty array fallback
    const events = (response.data || []) as CalendarEvent[];
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
    // Explicitly type the response to avoid deep instantiation issues
    const response = await supabase
      .from('calendar_events')
      .select('*')
      .in(columnName, filterIds);
    
    if (response.error) {
      console.error(`Error fetching events for ${filterType} with multiple IDs:`, response.error);
      return [];
    }

    // Use type assertion with an explicitly declared empty array fallback
    const events = (response.data || []) as CalendarEvent[];
    console.log(`Found ${events.length} events for ${filterType}`);
    return events;
  } catch (error) {
    console.error(`Unexpected error in fetchEventsByMultipleValues:`, error);
    return [];
  }
}

/**
 * Type definition for user events from the database
 */
interface UserEventFromDB {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  user_id: string;
  event_type: string;
  is_blocked: boolean;
  created_at: string;
  updated_at: string;
  metadata: Json;
  // The color and location might be in metadata or not present at all
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
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Map to calendar events with explicit typing
    // Safely mapping properties that might not exist in the source
    return data.map((event: UserEventFromDB): CalendarEvent => {
      // Create a base CalendarEvent with required fields
      const calendarEvent: CalendarEvent = {
        id: event.id,
        title: event.title,
        start_time: event.start_time,
        end_time: event.end_time,
        description: event.description || '',
        user_id: event.user_id
      };
      
      // Try to extract color and location from metadata if they exist
      if (event.metadata && typeof event.metadata === 'object') {
        const metadata = event.metadata as Record<string, any>;
        if (metadata.color) calendarEvent.color = metadata.color as string;
        if (metadata.location) calendarEvent.location = metadata.location as string;
      }
      
      return calendarEvent;
    });
  } catch (error) {
    console.error('Error in fetchUserEvents:', error);
    return [];
  }
};
