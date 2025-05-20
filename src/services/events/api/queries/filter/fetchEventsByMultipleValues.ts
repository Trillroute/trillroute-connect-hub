
import { supabase } from '@/integrations/supabase/client';
import { CalendarEvent } from '../../types/eventTypes';
import { formatEventData } from '../utils/eventFormatters';

/**
 * Fetch events filtered by multiple fields and values
 * @param filters Object containing field:value pairs to filter by
 */
export const fetchEventsByMultipleValues = async (
  filters: Partial<Record<keyof CalendarEvent, any>>
): Promise<CalendarEvent[]> => {
  try {
    let query = supabase
      .from('user_events')
      .select('*')
      .order('start_time', { ascending: true });

    // Apply each filter
    Object.entries(filters).forEach(([field, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(field, value);
      }
    });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching events by multiple values:', error);
      return [];
    }

    return formatEventData(data || []);
  } catch (error) {
    console.error('Exception in fetchEventsByMultipleValues:', error);
    return [];
  }
};
