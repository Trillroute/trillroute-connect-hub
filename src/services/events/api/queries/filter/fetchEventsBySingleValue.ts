
import { supabase } from '@/integrations/supabase/client';
import { PostgrestFilterBuilder } from '@supabase/supabase-js';

/**
 * Fetches events filtered by a single field value
 * @param field The field name to filter on
 * @param value The value to filter by
 * @returns Promise with the events data
 */
export const fetchEventsBySingleValue = async <T>(
  field: string,
  value: string | number | boolean
) => {
  try {
    // Using explicit type casting to avoid TypeScript depth issues
    const query = supabase
      .from('user_events')
      .select('*') as PostgrestFilterBuilder<any, any, any[]>;
    
    // Apply the filter
    const { data, error } = await query.eq(field, value);

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
