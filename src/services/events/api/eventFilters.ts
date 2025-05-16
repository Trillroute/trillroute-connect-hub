
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
    
    // Base query to select all events
    const baseQuery = supabase.from('calendar_events').select('*');
    
    // Apply filters based on filter type and IDs
    let filteredQuery = baseQuery;
    if (filterType && filterIds && filterIds.length > 0) {
      switch (filterType) {
        case 'course':
          filteredQuery = baseQuery.in('course_id', filterIds);
          break;
        case 'skill':
          filteredQuery = baseQuery.in('skill_id', filterIds);
          break;
        case 'teacher':
        case 'admin':
        case 'staff':
        case 'student':
          // User-related filters (teacher, admin, student) filter by user_id
          filteredQuery = baseQuery.in('user_id', filterIds);
          break;
      }
    }
    
    // Execute the query
    const { data: events, error } = await filteredQuery;
    
    if (error) {
      console.error('Error fetching filtered events:', error);
      return [];
    }
    
    console.log(`Found ${events?.length || 0} events for filter type ${filterType || 'none'}`);
    return events as CalendarEvent[] || [];
  } catch (error) {
    console.error('Exception fetching filtered events:', error);
    return [];
  }
};
