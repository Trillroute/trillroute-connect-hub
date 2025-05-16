
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
      const { data, error } = await supabase.from(tableName).select('*');
      
      if (error) {
        console.error('Error fetching all events:', error);
        return [];
      }
      
      console.log(`Found ${data?.length || 0} events (no filters)`);
      return data as CalendarEvent[] || [];
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
        const { data: defaultData, error: defaultError } = await supabase.from(tableName).select('*');
        if (defaultError) {
          console.error('Error fetching events:', defaultError);
          return [];
        }
        return defaultData as CalendarEvent[] || [];
    }
    
    // Handle filtering with simplified query approach
    let data: any[] = [];
    let error: any = null;
    
    if (filterIds.length === 1) {
      // For single ID, use simple equality filter
      const filterId = filterIds[0];
      const result = await supabase
        .from(tableName)
        .select('*')
        .eq(columnName, filterId);
        
      data = result.data || [];
      error = result.error;
    } else {
      // For multiple IDs, use IN filter
      const result = await supabase
        .from(tableName)
        .select('*')
        .in(columnName, filterIds);
        
      data = result.data || [];
      error = result.error;
    }
    
    if (error) {
      console.error('Error fetching filtered events:', error);
      return [];
    }
    
    console.log(`Found ${data.length || 0} events for filter type ${filterType}`);
    return data as CalendarEvent[];
    
  } catch (error) {
    console.error('Exception fetching filtered events:', error);
    return [];
  }
};
