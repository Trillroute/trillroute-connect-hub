
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
    
    // Base query - we'll execute different queries based on filter type rather than chaining
    const table = supabase.from('calendar_events');
    
    // Apply filters based on filter type and IDs
    if (filterType && filterIds && filterIds.length > 0) {
      switch (filterType) {
        case 'course': {
          // Handle course filtering
          const query = table.select('*');
          
          if (filterIds.length === 1) {
            // For single ID
            const { data, error } = await query.eq('course_id', filterIds[0]);
            if (error) throw error;
            return data as CalendarEvent[];
          } else {
            // For multiple IDs
            const { data, error } = await query.in('course_id', filterIds);
            if (error) throw error;
            return data as CalendarEvent[];
          }
        }
          
        case 'skill': {
          // Handle skill filtering
          const query = table.select('*');
          
          if (filterIds.length === 1) {
            const { data, error } = await query.eq('skill_id', filterIds[0]);
            if (error) throw error;
            return data as CalendarEvent[];
          } else {
            const { data, error } = await query.in('skill_id', filterIds);
            if (error) throw error;
            return data as CalendarEvent[];
          }
        }
          
        case 'teacher':
        case 'admin':
        case 'staff':
        case 'student': {
          // User-related filters filter by user_id
          const query = table.select('*');
          
          if (filterIds.length === 1) {
            const { data, error } = await query.eq('user_id', filterIds[0]);
            if (error) throw error;
            return data as CalendarEvent[];
          } else {
            const { data, error } = await query.in('user_id', filterIds);
            if (error) throw error;
            return data as CalendarEvent[];
          }
        }
      }
    }
    
    // If no specific filters or filterType doesn't match any case, return all events
    const { data: events, error } = await table.select('*');
    
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
