
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
    
    // Use a simpler typing approach to avoid deep type instantiation
    const response = await supabase
      .from('user_events')
      .select('*')
      .eq(columnName, value);
    
    if (response.error) {
      console.error('Error fetching events by single value:', response.error);
      return [];
    }
    
    // First cast the data to an array, then use the formatter
    const events = response.data || [];
    return formatEventData(events as UserEventFromDB[]);
  } catch (error) {
    console.error('Exception in fetchEventsBySingleValue:', error);
    return [];
  }
}
