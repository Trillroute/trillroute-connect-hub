
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
    
    const tableName = 'calendar_events';
    
    // Case 1: No filter type or empty filter IDs - return all events
    if (!filterType || filterIds.length === 0) {
      const result = await supabase.from(tableName).select('*');
      
      if (result.error) {
        console.error('Error fetching all events:', result.error);
        return [];
      }
      
      console.log(`Found ${result.data?.length || 0} events (no filters)`);
      return result.data as CalendarEvent[] || [];
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
        const defaultResult = await supabase.from(tableName).select('*');
        if (defaultResult.error) {
          console.error('Error fetching events:', defaultResult.error);
          return [];
        }
        return defaultResult.data as CalendarEvent[] || [];
    }
    
    // Execute query based on filter condition
    let result;
    
    // Use separate execution paths to avoid deep type nesting
    if (filterIds.length === 1) {
      // Single ID filter
      result = await supabase
        .from(tableName)
        .select('*')
        .eq(columnName, filterIds[0]);
    } else {
      // Multiple IDs filter
      result = await supabase
        .from(tableName)
        .select('*')
        .in(columnName, filterIds);
    }
    
    if (result.error) {
      console.error('Error fetching filtered events:', result.error);
      return [];
    }
    
    console.log(`Found ${result.data?.length || 0} events for filter type ${filterType}`);
    return result.data as CalendarEvent[] || [];
    
  } catch (error) {
    console.error('Exception fetching filtered events:', error);
    return [];
  }
};
