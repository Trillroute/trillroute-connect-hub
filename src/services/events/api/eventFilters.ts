
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
    let query = supabase.from(tableName).select('*');
    
    // If there's a filter type and IDs, apply the filter
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
          // Default case - no need to apply any filter
          const { data, error } = await query;
          
          if (error) {
            console.error('Error fetching events:', error);
            return [];
          }
          
          return data as CalendarEvent[];
      }
      
      // Apply filter and execute query
      if (filterIds.length === 1) {
        // Single ID filter
        const { data, error } = await query.eq(columnName, filterIds[0]);
        
        if (error) {
          console.error('Error fetching filtered events:', error);
          return [];
        }
        
        return data as CalendarEvent[];
      } else {
        // Multiple IDs filter
        const { data, error } = await query.in(columnName, filterIds);
        
        if (error) {
          console.error('Error fetching filtered events:', error);
          return [];
        }
        
        return data as CalendarEvent[];
      }
    }
    
    // No specific filters, return all events
    const { data, error } = await query;
    
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
