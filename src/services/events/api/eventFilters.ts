
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
    
    // Handle the case with no filters
    if (!filterType || filterIds.length === 0) {
      const response = await supabase.from('calendar_events').select('*');
      
      if (response.error) {
        console.error('Error fetching all events:', response.error);
        return [];
      }
      
      console.log(`Found ${response.data.length || 0} events (no filters)`);
      return response.data;
    }
    
    // Determine which column to filter on
    let columnToFilter: string;
    
    switch (filterType) {
      case 'course':
        columnToFilter = 'course_id';
        break;
      case 'skill':
        columnToFilter = 'skill_id';
        break;
      case 'teacher':
      case 'student':
      case 'admin':
      case 'staff':
        columnToFilter = 'user_id';
        break;
      default:
        // Fallback for unknown filter types
        const fallbackResponse = await supabase.from('calendar_events').select('*');
        if (fallbackResponse.error) {
          console.error('Error fetching events:', fallbackResponse.error);
          return [];
        }
        return fallbackResponse.data;
    }
    
    // Handle filtering with a single ID
    if (filterIds.length === 1) {
      const response = await supabase
        .from('calendar_events')
        .select('*')
        .eq(columnToFilter, filterIds[0]);
      
      if (response.error) {
        console.error('Error fetching filtered events:', response.error);
        return [];
      }
      
      console.log(`Found ${response.data.length || 0} events for filter type ${filterType}`);
      return response.data;
    } 
    
    // Handle filtering with multiple IDs
    const response = await supabase
      .from('calendar_events')
      .select('*')
      .in(columnToFilter, filterIds);
    
    if (response.error) {
      console.error('Error fetching filtered events:', response.error);
      return [];
    }
    
    console.log(`Found ${response.data.length || 0} events for filter type ${filterType}`);
    return response.data;
    
  } catch (error) {
    console.error('Exception fetching filtered events:', error);
    return [];
  }
};
