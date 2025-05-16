
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
    
    // Case 1: No filters - return all events
    if (!filterType || filterIds.length === 0) {
      const result = await supabase.from('calendar_events').select('*');
      
      if (result.error) {
        console.error('Error fetching all events:', result.error);
        return [];
      }
      
      console.log(`Found ${result.data?.length || 0} events (no filters)`);
      return result.data || [];
    }
    
    // Case 2: Determine column name for filtering
    let columnName = '';
    
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
        const allEvents = await supabase.from('calendar_events').select('*');
        if (allEvents.error) {
          console.error('Error fetching events with unknown filter:', allEvents.error);
          return [];
        }
        return allEvents.data || [];
    }
    
    // Case 3: Filter by single ID
    if (filterIds.length === 1) {
      const singleResult = await supabase
        .from('calendar_events')
        .select('*')
        .eq(columnName, filterIds[0]);
      
      if (singleResult.error) {
        console.error(`Error fetching events for ${filterType} with ID ${filterIds[0]}:`, singleResult.error);
        return [];
      }
      
      console.log(`Found ${singleResult.data?.length || 0} events for ${filterType} with ID ${filterIds[0]}`);
      return singleResult.data || [];
    }
    
    // Case 4: Filter by multiple IDs
    const multiResult = await supabase
      .from('calendar_events')
      .select('*')
      .in(columnName, filterIds);
    
    if (multiResult.error) {
      console.error(`Error fetching events for ${filterType} with multiple IDs:`, multiResult.error);
      return [];
    }
    
    console.log(`Found ${multiResult.data?.length || 0} events for ${filterType}`);
    return multiResult.data || [];
  } catch (error) {
    console.error('Exception fetching filtered events:', error);
    return [];
  }
}
