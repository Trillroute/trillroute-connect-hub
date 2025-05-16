
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
    
    // Start with a base query - explicitly typed to return CalendarEvents
    let query = supabase.from('calendar_events').select('*');
    
    // Apply filters based on filter type and IDs
    if (filterType && filterIds && filterIds.length > 0) {
      switch (filterType) {
        case 'course':
          query = query.filter('course_id', 'in', filterIds);
          break;
        case 'skill':
          query = query.filter('skill_id', 'in', filterIds);
          break;
        case 'teacher':
        case 'admin':
        case 'staff':
        case 'student':
          // User-related filters (teacher, admin, student) filter by user_id
          query = query.filter('user_id', 'in', filterIds);
          break;
      }
    }
    
    // Execute the query with explicit typing
    const { data: events, error } = await query;
    
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
