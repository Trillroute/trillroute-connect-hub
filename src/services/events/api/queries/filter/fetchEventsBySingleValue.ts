
import { supabase } from '@/integrations/supabase/client';

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
) {
  try {
    console.log(`Fetching events where ${columnName} = ${value}`);
    
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq(columnName, value);
    
    if (error) {
      console.error('Error fetching events by single value:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception in fetchEventsBySingleValue:', error);
    return [];
  }
}
