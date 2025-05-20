
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
    
    // Use the Any type to bypass TypeScript's type inference completely
    const query = supabase
      .from('user_events')
      .select('*')
      .eq(columnName, value);
    
    // Execute the query without TypeScript trying to infer the types
    const response = await query;
    
    if (response.error) {
      console.error('Error fetching events by single value:', response.error);
      return [];
    }
    
    // Explicitly cast the data as an array of UserEventFromDB objects
    const events = (response.data || []) as UserEventFromDB[];
    return formatEventData(events);
  } catch (error) {
    console.error('Exception in fetchEventsBySingleValue:', error);
    return [];
  }
}
