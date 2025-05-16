
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
    
    // Start with a base query
    let query = supabase.from('calendar_events').select('*');
    
    // Apply filters based on filter type and IDs
    if (filterType && filterIds && filterIds.length > 0) {
      switch (filterType) {
        case 'course':
          // Handle course filtering
          if (filterIds.length === 1) {
            query = query.eq('course_id', filterIds[0]);
          } else {
            // Use in() for multiple IDs - more efficient than chaining or conditions
            query = query.in('course_id', filterIds);
          }
          break;
          
        case 'skill':
          // Handle skill filtering
          if (filterIds.length === 1) {
            query = query.eq('skill_id', filterIds[0]);
          } else {
            query = query.in('skill_id', filterIds);
          }
          break;
          
        case 'teacher':
        case 'admin':
        case 'staff':
        case 'student':
          // User-related filters filter by user_id
          if (filterIds.length === 1) {
            query = query.eq('user_id', filterIds[0]);
          } else {
            query = query.in('user_id', filterIds);
          }
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
    return events as CalendarEvent[] || [];
  } catch (error) {
    console.error('Exception fetching filtered events:', error);
    return [];
  }
};
