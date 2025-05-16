
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
interface CalendarEvent {
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
 * Fetch events based on specified filter type and IDs
 */
export const fetchEventsByFilter = async ({ filterType, filterIds = [] }: FilterEventsProps): Promise<CalendarEvent[]> => {
  try {
    console.log(`Fetching events with filter type: ${filterType || 'none'}, IDs: ${filterIds.join(',') || 'none'}`);
    
    // Base table name
    const tableName = 'calendar_events';
    
    // Case 1: No filter type or empty filter IDs - return all events
    if (!filterType || filterIds.length === 0) {
      const response = await supabase.from(tableName).select('*');
      if (response.error) {
        console.error('Error fetching all events:', response.error);
        return [];
      }
      
      console.log(`Found ${response.data?.length || 0} events (no filters)`);
      return response.data || [];
    }
    
    // Determine which column to filter on based on the filter type
    let columnName: string;
    switch (filterType) {
      case 'course':
        columnName = 'course_id';
        break;
      case 'skill':
        columnName = 'skill_id';
        break;
      case 'teacher':
      case 'admin':
      case 'staff':
      case 'student':
        columnName = 'user_id';
        break;
      default:
        // Default case - return all events for unknown filter types
        const defaultResponse = await supabase.from(tableName).select('*');
        if (defaultResponse.error) {
          console.error('Error fetching events:', defaultResponse.error);
          return [];
        }
        return defaultResponse.data || [];
    }
    
    // Case 2: Single ID filter
    if (filterIds.length === 1) {
      // Separate variable assignment to reduce type complexity
      const response = await supabase
        .from(tableName)
        .select('*')
        .eq(columnName, filterIds[0]);
      
      if (response.error) {
        console.error('Error fetching filtered events:', response.error);
        return [];
      }
      
      return response.data || [];
    }
    
    // Case 3: Multiple IDs filter
    // Using explicit variable assignment to avoid deep type instantiation
    const response = await supabase
      .from(tableName)
      .select('*')
      .in(columnName, filterIds);
    
    if (response.error) {
      console.error('Error fetching filtered events:', response.error);
      return [];
    }
    
    console.log(`Found ${response.data?.length || 0} events for filter type ${filterType}`);
    return response.data || [];
    
  } catch (error) {
    console.error('Exception fetching filtered events:', error);
    return [];
  }
};
