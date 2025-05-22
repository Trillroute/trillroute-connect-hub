
import { supabase } from '@/integrations/supabase/client';
import { PostgrestFilterBuilder } from '@supabase/supabase-js';

/**
 * Fetches events filtered by multiple field values
 * @param field The field name to filter on
 * @param values Array of values to match against the field
 * @returns Promise with the events data
 */
export const fetchEventsByMultipleValues = async <T>(
  field: string,
  values: (string | number | boolean)[]
) => {
  try {
    if (!values.length) {
      return [];
    }
    
    // Using explicit type casting to avoid TypeScript depth issues
    const query = supabase
      .from('user_events')
      .select('*') as PostgrestFilterBuilder<any, any, any[]>;
    
    // Apply the filter
    const { data, error } = await query.in(field, values);
    
    if (error) {
      console.error('Error fetching events by multiple values:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error in fetchEventsByMultipleValues:', error);
    return [];
  }
};
