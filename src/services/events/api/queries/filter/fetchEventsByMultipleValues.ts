
import { supabase } from '@/integrations/supabase/client';
import { CalendarEvent } from '../../types/eventTypes';
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
    
    // Build the query without explicit typing
    let query = supabase.from('user_events').select('*');
    
    // Apply each filter to the query
    for (const [column, value] of Object.entries(filters)) {
      query = query.eq(column, value);
    }
    
    // Execute the query
    const result = await query;
    const { data, error } = result;
    
    if (error) {
      console.error('Error fetching events by multiple values:', error);
      return [];
    }
    
    // Use the formatting utility to transform the data
    return formatEventData(data || []);
  } catch (error) {
    console.error('Exception in fetchEventsByMultipleValues:', error);
    return [];
  }
}
