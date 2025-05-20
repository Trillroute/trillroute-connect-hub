
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
    
    // Perform the query without explicit typing on the query itself
    const result = await supabase
      .from('user_events')
      .select('*')
      .eq(columnName, value);
    
    const { data, error } = result;
    
    if (error) {
      console.error('Error fetching events by single value:', error);
      return [];
    }
    
    // Use the formatting utility to transform the data
    return formatEventData(data || []);
  } catch (error) {
    console.error('Exception in fetchEventsBySingleValue:', error);
    return [];
  }
}
