
import { supabase } from '@/integrations/supabase/client';
import { CalendarEvent } from '../../types/eventTypes';
import { formatEventData } from '../utils/eventFormatters';

/**
 * Fetch events by multiple values for a specific column
 */
export const fetchEventsByMultipleValues = async (
  columnName: string,
  filterType: string,
  values: string[]
): Promise<CalendarEvent[]> => {
  try {
    const { data, error } = await supabase
      .from('user_events')
      .select('*')
      .in(columnName, values)
      .order('start_time', { ascending: true });

    if (error) {
      console.error(`Error fetching events by multiple ${columnName} values:`, error);
      return [];
    }

    return formatEventData(data || []);
  } catch (error) {
    console.error(`Exception in fetchEventsByMultipleValues for ${columnName}:`, error);
    return [];
  }
};
