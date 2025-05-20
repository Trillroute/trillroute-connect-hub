
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
    
    // Create the query without executing it immediately
    const query = supabase
      .from('user_events')
      .select('*')
      .eq(columnName, value);
    
    // Execute the query as a generic Promise to avoid TypeScript deep instantiation
    const response = await query;
    
    // Handle query error
    if (response.error) {
      console.error('Error fetching events by single value:', response.error);
      return [];
    }
    
    // Cast the data to our expected type
    const events = (response.data || []) as UserEventFromDB[];
    return formatEventData(events);
  } catch (error) {
    console.error('Exception in fetchEventsBySingleValue:', error);
    return [];
  }
}
