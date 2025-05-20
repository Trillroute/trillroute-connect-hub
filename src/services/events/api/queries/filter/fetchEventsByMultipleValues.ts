
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetch events based on multiple filter criteria
 * 
 * @param filters Object containing column names as keys and filter values
 * @returns Array of event objects or empty array if none found
 */
export async function fetchEventsByMultipleValues(filters: Record<string, any>) {
  try {
    console.log('Fetching events with multiple filters:', filters);
    
    // Use type casting to handle the table name properly
    let query = supabase.from('user_events').select('*');
    
    // Apply each filter to the query
    for (const [column, value] of Object.entries(filters)) {
      query = query.eq(column, value);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching events by multiple values:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception in fetchEventsByMultipleValues:', error);
    return [];
  }
}
