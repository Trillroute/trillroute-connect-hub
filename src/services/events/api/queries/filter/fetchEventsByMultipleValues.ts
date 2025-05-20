
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
    
    // Build the query manually, avoiding deep type instantiation
    let queryBuilder = supabase.from('user_events').select('*');
    
    // Apply filters
    for (const [column, value] of Object.entries(filters)) {
      queryBuilder = queryBuilder.eq(column, value);
    }
    
    // Execute the query with 'any' type to avoid TypeScript inference issues
    const result = await (queryBuilder as any);
    const { data, error } = result;
    
    if (error) {
      console.error('Error fetching events by multiple values:', error);
      return [];
    }
    
    // Explicitly cast the result
    const events = (data || []) as UserEventFromDB[];
    return formatEventData(events);
  } catch (error) {
    console.error('Exception in fetchEventsByMultipleValues:', error);
    return [];
  }
}
