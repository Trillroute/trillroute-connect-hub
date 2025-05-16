
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
          const { data: allData, error: allError } = await supabase
            .from(tableName)
            .select('*');
          
          if (allError) throw allError;
          return allData as CalendarEvent[];
      }
      
      // Execute one query at a time with proper await to avoid deep type instantiation
      if (filterIds.length === 1) {
        // For a single ID, use a simple query
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .eq(columnName, filterIds[0]);
        
        if (error) throw error;
        return data as CalendarEvent[];
      } else {
        // For multiple IDs, use the 'in' filter
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .in(columnName, filterIds);
        
        if (error) throw error;
        return data as CalendarEvent[];
      }
    }
    
    // If no specific filters or filterIds is empty, return all events
    const { data, error } = await supabase
      .from(tableName)
      .select('*');
    
    if (error) {
      console.error('Error fetching filtered events:', error);
      return [];
    }
    
    console.log(`Found ${data?.length || 0} events for filter type ${filterType || 'none'}`);
    return data as CalendarEvent[] || [];
  } catch (error) {
    console.error('Exception fetching filtered events:', error);
    return [];
  }
};
