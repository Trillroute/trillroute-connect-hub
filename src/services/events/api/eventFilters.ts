
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
  // Extract filter properties with default empty array for filterIds
  const { filterType, filterIds = [] } = props;
  
  try {
    // Log the filter parameters
    console.log(`Fetching events with filter type: ${filterType || 'none'}, IDs: ${filterIds.join(',') || 'none'}`);
    
    // No filters scenario - return all events
    if (!filterType || filterIds.length === 0) {
      const { data, error } = await supabase.from('calendar_events').select('*');
      
      if (error) {
        console.error('Error fetching all events:', error);
        return [];
      }
      
      console.log(`Found ${data?.length || 0} events (no filters)`);
      return data || [];
    }
    
    // Determine the column name to use for filtering
    let columnName: string;
    
    // Simple switch to map filter type to column name
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
        // For unknown filter types, return all events
        const { data: allData, error: allError } = await supabase.from('calendar_events').select('*');
        
        if (allError) {
          console.error('Error fetching events with unknown filter type:', allError);
          return [];
        }
        
        return allData || [];
    }
    
    // For single ID filtering
    if (filterIds.length === 1) {
      const { data: singleData, error: singleError } = await supabase
        .from('calendar_events')
        .select('*')
        .eq(columnName, filterIds[0]);
      
      if (singleError) {
        console.error('Error fetching events for single ID:', singleError);
        return [];
      }
      
      console.log(`Found ${singleData?.length || 0} events for filter type ${filterType} with ID ${filterIds[0]}`);
      return singleData || [];
    }
    
    // For multiple IDs filtering
    const { data: multiData, error: multiError } = await supabase
      .from('calendar_events')
      .select('*')
      .in(columnName, filterIds);
    
    if (multiError) {
      console.error('Error fetching events for multiple IDs:', multiError);
      return [];
    }
    
    console.log(`Found ${multiData?.length || 0} events for filter type ${filterType}`);
    return multiData || [];
    
  } catch (error) {
    console.error('Exception fetching filtered events:', error);
    return [];
  }
}
