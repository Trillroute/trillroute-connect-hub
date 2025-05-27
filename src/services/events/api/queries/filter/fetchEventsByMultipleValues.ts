
import { supabase } from '@/integrations/supabase/client';

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
    
    // Completely bypass TypeScript type checking to avoid deep instantiation errors
    const supabaseClient = supabase as any;
    const { data, error } = await supabaseClient
      .from('user_events')
      .select('*')
      .in(field, values);
    
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
