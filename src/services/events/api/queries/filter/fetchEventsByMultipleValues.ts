
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
    
    // Execute the query and handle the response manually to avoid TypeScript depth issue
    const response = await queryBuilder;
    const { data, error } = response as { data: UserEventFromDB[] | null, error: any };
    
    // Handle query error
    if (error) {
      console.error('Error fetching events by multiple values:', error);
      return [];
    }
    
    // Return formatted data or empty array
    return formatEventData(data || []);
  } catch (error) {
    console.error('Exception in fetchEventsByMultipleValues:', error);
    return [];
  }
}
