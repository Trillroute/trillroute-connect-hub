
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
    
    // If no filter type or empty filter IDs, return all events
    if (!filterType || filterIds.length === 0) {
      const { data, error } = await supabase.from(tableName).select('*');
      
      if (error) {
        console.error('Error fetching all events:', error);
        return [];
      }
      
      console.log(`Found ${data?.length || 0} events (no filters)`);
      return data || [];
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
        // Default case - fetch all events without filtering
        const { data: defaultData, error: defaultError } = await supabase.from(tableName).select('*');
        
        if (defaultError) {
          console.error('Error fetching events:', defaultError);
          return [];
        }
        
        return defaultData || [];
    }
    
    // Execute query based on number of IDs
    if (filterIds.length === 1) {
      // For a single ID, use eq operator
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq(columnName, filterIds[0]);
      
      if (error) {
        console.error('Error fetching filtered events:', error);
        return [];
      }
      
      return data || [];
    } else {
      // For multiple IDs, use in operator
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .in(columnName, filterIds);
      
      if (error) {
        console.error('Error fetching filtered events:', error);
        return [];
      }
      
      console.log(`Found ${data?.length || 0} events for filter type ${filterType}`);
      return data || [];
    }
  } catch (error) {
    console.error('Exception fetching filtered events:', error);
    return [];
  }
};
