
import { supabase } from '@/integrations/supabase/client';
import { CalendarEvent, UserEventFromDB } from '../../types/eventTypes';
import { formatEventData } from '../utils/eventFormatters';

/**
 * Fetch events where a specific column matches a single value
 * 
 * @param columnName The column name to filter by
 * @param value The value to match against the column
 * @returns Array of event objects or empty array if none found
 */
export async function fetchEventsBySingleValue(
  columnName: string,
  value: any
): Promise<CalendarEvent[]> {
  try {
    console.log(`Fetching events where ${columnName} = ${value}`);
    
    // Create and execute the query
    const { data, error } = await supabase
      .from('user_events')
      .select('*')
      .eq(columnName, value);
    
    // Handle query error
    if (error) {
      console.error('Error fetching events by single value:', error);
      return [];
    }
    
    // Return formatted data or empty array
    return formatEventData(data as UserEventFromDB[] || []);
  } catch (error) {
    console.error('Exception in fetchEventsBySingleValue:', error);
    return [];
  }
}
