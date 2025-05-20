
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
    
    // Create the base query
    const query = supabase.from('user_events').select('*');
    
    // Apply all filters as conditions
    let filteredQuery = query;
    for (const [column, value] of Object.entries(filters)) {
      filteredQuery = filteredQuery.eq(column, value);
    }
    
    // Execute the query as a generic request without TypeScript inference
    const { data, error } = await filteredQuery;
    
    if (error) {
      console.error('Error fetching events by multiple values:', error);
      return [];
    }
    
    // Explicitly cast the result as UserEventFromDB[]
    const events = (data || []) as UserEventFromDB[];
    return formatEventData(events);
  } catch (error) {
    console.error('Exception in fetchEventsByMultipleValues:', error);
    return [];
  }
}
