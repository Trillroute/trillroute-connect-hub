
import { supabase } from '@/integrations/supabase/client';
import { CalendarEvent } from '../../types/eventTypes';
import { formatEventData } from '../utils/eventFormatters';

/**
 * Fetch events filtered by a single value
 * @param field The field to filter by
 * @param value The value to filter for
 */
export const fetchEventsBySingleValue = async (
  field: string, 
  value: any
): Promise<CalendarEvent[]> => {
  try {
    const { data, error } = await supabase
      .from('user_events')
      .select('*')
      .eq(field, value)
      .order('start_time', { ascending: true });

    if (error) {
      console.error(`Error fetching events by ${field}:`, error);
      return [];
    }

    return formatEventData(data || []);
  } catch (error) {
    console.error(`Exception in fetchEventsBySingleValue:`, error);
    return [];
  }
};
