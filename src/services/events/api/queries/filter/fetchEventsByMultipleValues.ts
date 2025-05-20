
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
    
    // Build the query
    let query = supabase.from('user_events').select('*');
    
    // Apply each filter to the query
    for (const [column, value] of Object.entries(filters)) {
      query = query.eq(column, value);
    }
    
    // Execute the query with explicit typing to avoid recursive type inference
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching events by multiple values:', error);
      return [];
    }
    
    // Use the formatting utility to transform the data
    return formatEventData(data as UserEventFromDB[] || []);
  } catch (error) {
    console.error('Exception in fetchEventsByMultipleValues:', error);
    return [];
  }
}
