
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
          const defaultResult = await supabase.from(tableName).select('*');
          
          if (defaultResult.error) {
            console.error('Error fetching events:', defaultResult.error);
            return [];
          }
          
          return defaultResult.data as CalendarEvent[];
      }
      
      // Apply filter and execute query
      if (filterIds.length === 1) {
        // Single ID filter - execute as a separate complete query
        const singleFilterResult = await supabase
          .from(tableName)
          .select('*')
          .eq(columnName, filterIds[0]);
        
        if (singleFilterResult.error) {
          console.error('Error fetching filtered events:', singleFilterResult.error);
          return [];
        }
        
        return singleFilterResult.data as CalendarEvent[];
      } else {
        // Multiple IDs filter - execute as a separate complete query
        const multiFilterResult = await supabase
          .from(tableName)
          .select('*')
          .in(columnName, filterIds);
        
        if (multiFilterResult.error) {
          console.error('Error fetching filtered events:', multiFilterResult.error);
          return [];
        }
        
        return multiFilterResult.data as CalendarEvent[];
      }
    }
    
    // No specific filters, return all events
    const allEventsResult = await supabase.from(tableName).select('*');
    
    if (allEventsResult.error) {
      console.error('Error fetching all events:', allEventsResult.error);
      return [];
    }
    
    console.log(`Found ${allEventsResult.data?.length || 0} events for filter type ${filterType || 'none'}`);
    return allEventsResult.data as CalendarEvent[] || [];
  } catch (error) {
    console.error('Exception fetching filtered events:', error);
    return [];
  }
};
