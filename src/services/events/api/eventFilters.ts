
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
    
    // Base query
    const tableName = 'calendar_events';
    
    // Apply filters based on filter type and IDs
    if (filterType && filterIds && filterIds.length > 0) {
      let columnName: string;
      
      // Determine which column to filter on based on the filter type
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
          // If filterType doesn't match any case, fetch all events
          const allEventsQuery = await supabase.from(tableName).select('*');
          if (allEventsQuery.error) throw allEventsQuery.error;
          return allEventsQuery.data as CalendarEvent[];
      }
      
      // Break the filtering into separate code paths to avoid deep type instantiation
      if (filterIds.length === 1) {
        // For a single ID, use direct equality check
        const singleIdQuery = await supabase
          .from(tableName)
          .select('*');
        
        // Apply the filter after the select to avoid chaining that causes deep types
        const filteredQuery = singleIdQuery.eq(columnName, filterIds[0]);
        const result = await filteredQuery;
        
        if (result.error) throw result.error;
        return result.data as CalendarEvent[];
      } else {
        // For multiple IDs, use a simpler approach
        // Build the query in steps to avoid deep nesting of types
        const baseQuery = supabase.from(tableName).select('*');
        const result = await baseQuery.in(columnName, filterIds);
        
        if (result.error) throw result.error;
        return result.data as CalendarEvent[];
      }
    }
    
    // If no specific filters or filterIds is empty, return all events
    // Use a simpler query approach to avoid deep type instantiation
    const baseQuery = supabase.from(tableName);
    const selectQuery = baseQuery.select('*');
    const result = await selectQuery;
    
    if (result.error) {
      console.error('Error fetching filtered events:', result.error);
      return [];
    }
    
    console.log(`Found ${result.data?.length || 0} events for filter type ${filterType || 'none'}`);
    return result.data as CalendarEvent[] || [];
  } catch (error) {
    console.error('Exception fetching filtered events:', error);
    return [];
  }
};
