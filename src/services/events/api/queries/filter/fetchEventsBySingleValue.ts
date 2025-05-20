
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
    
    // Use a two-step approach to avoid type inference issues
    const query = supabase
      .from('user_events')
      .select('*')
      .eq(columnName, value);
    
    // Cast to Promise<any> to avoid deep type instantiation
    const { data, error } = await (query as any);
    
    if (error) {
      console.error('Error fetching events by single value:', error);
      return [];
    }
    
    // Explicitly cast the data to the proper type after retrieval
    const events = (data || []) as UserEventFromDB[];
    return formatEventData(events);
  } catch (error) {
    console.error('Exception in fetchEventsBySingleValue:', error);
    return [];
  }
}
