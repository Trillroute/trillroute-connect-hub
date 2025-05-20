
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
    
    // Build the query without type inference
    let query = supabase.from('user_events').select('*');
    
    // Apply each filter to the query
    for (const [column, value] of Object.entries(filters)) {
      query = query.eq(column, value);
    }
    
    // Execute the query without TypeScript trying to infer the types
    const response = await query;
    
    if (response.error) {
      console.error('Error fetching events by multiple values:', response.error);
      return [];
    }
    
    // Explicitly cast the data as an array of UserEventFromDB objects
    const events = (response.data || []) as UserEventFromDB[];
    return formatEventData(events);
  } catch (error) {
    console.error('Exception in fetchEventsByMultipleValues:', error);
    return [];
  }
}
