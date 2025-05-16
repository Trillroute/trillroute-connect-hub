
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
 * Fetch events based on specified filter type and IDs
 */
export const fetchEventsByFilter = async ({ filterType, filterIds = [] }: FilterEventsProps) => {
  try {
    console.log(`Fetching events with filter type: ${filterType || 'none'}, IDs: ${filterIds.join(',') || 'none'}`);
    
    // Base query to select all events
    let query = supabase.from('calendar_events').select('*');
    
    // Apply filters based on filter type and IDs
    if (filterType && filterIds && filterIds.length > 0) {
      switch (filterType) {
        case 'course':
          query = query.in('course_id', filterIds);
          break;
        case 'skill':
          query = query.in('skill_id', filterIds);
          break;
        case 'teacher':
        case 'admin':
        case 'staff':
        case 'student':
          // User-related filters (teacher, admin, student) filter by user_id
          query = query.in('user_id', filterIds);
          break;
      }
    }
    
    // Execute the query
    const { data: events, error } = await query;
    
    if (error) {
      console.error('Error fetching filtered events:', error);
      return [];
    }
    
    console.log(`Found ${events?.length || 0} events for filter type ${filterType || 'none'}`);
    return events || [];
  } catch (error) {
    console.error('Exception fetching filtered events:', error);
    return [];
  }
};
