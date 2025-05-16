
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
export async function fetchEventsByFilter(props: FilterEventsProps): Promise<CalendarEvent[]> {
  const { filterType, filterIds = [] } = props;
  
  try {
    console.log(`Fetching events with filter type: ${filterType || 'none'}, IDs: ${filterIds.join(',') || 'none'}`);
    
    // Handle case with no filters - return all events
    if (!filterType || filterIds.length === 0) {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*');
      
      if (error) {
        console.error('Error fetching all events:', error);
        return [];
      }
      
      console.log(`Found ${data?.length || 0} events (no filters)`);
      return data || [];
    }
    
    // Determine column name for filtering
    let columnName: string;
    
    switch (filterType) {
      case 'course':
        columnName = 'course_id';
        break;
      case 'skill':
        columnName = 'skill_id';
        break;
      case 'teacher':
      case 'student':
      case 'admin':
      case 'staff':
        columnName = 'user_id';
        break;
      default:
        // Fallback for unknown filter types
        const { data, error } = await supabase
          .from('calendar_events')
          .select('*');
          
        if (error) {
          console.error('Error fetching events with unknown filter:', error);
          return [];
        }
        
        return data || [];
    }
    
    // Handle filtering by IDs
    if (filterIds.length === 1) {
      // Filter by a single ID
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq(columnName, filterIds[0]);
      
      if (error) {
        console.error(`Error fetching events for ${filterType} with ID ${filterIds[0]}:`, error);
        return [];
      }
      
      console.log(`Found ${data?.length || 0} events for ${filterType} with ID ${filterIds[0]}`);
      return data || [];
    } else {
      // Filter by multiple IDs
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .in(columnName, filterIds);
      
      if (error) {
        console.error(`Error fetching events for ${filterType} with multiple IDs:`, error);
        return [];
      }
      
      console.log(`Found ${data?.length || 0} events for ${filterType}`);
      return data || [];
    }
  } catch (error) {
    console.error('Exception fetching filtered events:', error);
    return [];
  }
}
