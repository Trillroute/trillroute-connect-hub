
import { supabase } from '@/integrations/supabase/client';
import { CalendarEvent } from '../../types/eventTypes';
import { formatEventData } from '../utils/eventFormatters';

/**
 * Fetch events by a single value for a specific column
 */
export const fetchEventsBySingleValue = async (
  columnName: string,
  filterType: string,
  value: string
): Promise<CalendarEvent[]> => {
  try {
    const { data, error } = await supabase
      .from('user_events')
      .select('*')
      .eq(columnName, value)
      .order('start_time', { ascending: true });

    if (error) {
      console.error(`Error fetching events by ${columnName}:`, error);
      return [];
    }

    return formatEventData(data || []);
  } catch (error) {
    console.error(`Exception in fetchEventsBySingleValue for ${columnName}:`, error);
    return [];
  }
};
