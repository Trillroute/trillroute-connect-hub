
import { supabase } from '@/integrations/supabase/client';
import { CalendarEvent, UserEventFromDB } from '../../types/eventTypes';
import { formatEventData } from '../utils/eventFormatters';

/**
 * Fetch events based on multiple filter criteria
 * 
 * @param filters Object containing column names as keys and filter values
 * @returns Array of event objects or empty array if none found
 */
export async function fetchEventsByMultipleValues(filters: Record<string, any>): Promise<CalendarEvent[]> {
  try {
    console.log('Fetching events with multiple filters:', filters);
    
    // Start with the base query builder
    let queryBuilder = supabase.from('user_events').select('*');
    
    // Apply all filters sequentially
    for (const [column, value] of Object.entries(filters)) {
      queryBuilder = queryBuilder.eq(column, value);
    }
    
    // Execute the query and cast the result to any to avoid TypeScript deep instantiation
    const { data, error } = await queryBuilder as any;
    
    // Handle query error
    if (error) {
      console.error('Error fetching events by multiple values:', error);
      return [];
    }
    
    // Cast the data to our expected type
    const events = (data || []) as UserEventFromDB[];
    return formatEventData(events);
  } catch (error) {
    console.error('Exception in fetchEventsByMultipleValues:', error);
    return [];
  }
}
