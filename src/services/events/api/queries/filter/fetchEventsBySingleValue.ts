
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetches events filtered by a single field value
 * @param field The field name to filter on
 * @param value The value to filter by
 * @returns Promise with the events data
 */
export const fetchEventsBySingleValue = async (
  field: string,
  value: string | number | boolean
): Promise<any[]> => {
  try {
    // Use a more explicit query structure to avoid deep type instantiation
    const query = supabase
      .from('user_events')
      .select('*');
    
    // Apply the filter dynamically
    const { data, error } = await query.eq(field as any, value);
    
    if (error) {
      console.error('Error fetching events by single value:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error in fetchEventsBySingleValue:', error);
    return [];
  }
};
