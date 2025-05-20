
import { supabase } from '@/integrations/supabase/client';
import { CalendarEvent } from '../../types/eventTypes';
import { formatEventData } from '../utils/eventFormatters';
import { format } from 'date-fns';

/**
 * Fetch events within a date range for all users or a specific user
 */
export const fetchEventsInRange = async (
  startDate: Date,
  endDate: Date,
  userId?: string
): Promise<CalendarEvent[]> => {
  try {
    let query = supabase
      .from('user_events')
      .select('*')
      .gte('start_time', format(startDate, "yyyy-MM-dd'T'00:00:00"))
      .lte('end_time', format(endDate, "yyyy-MM-dd'T'23:59:59"))
      .order('start_time', { ascending: true });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching events in range:', error);
      return [];
    }

    return formatEventData(data || []);
  } catch (error) {
    console.error('Exception in fetchEventsInRange:', error);
    return [];
  }
};
