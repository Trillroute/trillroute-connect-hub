
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
    
    // Start with the base query builder
    let queryBuilder = supabase.from('user_events').select('*');
    
    // Apply all filters sequentially
    for (const [column, value] of Object.entries(filters)) {
      queryBuilder = queryBuilder.eq(column, value);
    }
    
    // Execute query as unknown type first, then cast result
    const response = await (queryBuilder as unknown as Promise<{data: any[], error: any}>);
    const { data, error } = response;
    
    if (error) {
      console.error('Error fetching events by multiple values:', error);
      return [];
    }
    
    // Explicitly cast the data to the proper type after retrieval
    const events = (data || []) as UserEventFromDB[];
    return formatEventData(events);
  } catch (error) {
    console.error('Exception in fetchEventsByMultipleValues:', error);
    return [];
  }
}
