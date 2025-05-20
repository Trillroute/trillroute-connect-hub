
import { supabase } from '@/integrations/supabase/client';
import { CalendarEvent } from '../../types/eventTypes';
import { formatEventData } from '../utils/eventFormatters';
import { format } from 'date-fns';

/**
 * Fetch events for specific users within a date range
 */
export const fetchEventsForUsersInRange = async (
  userIds: string[],
  startDate: Date,
  endDate: Date
): Promise<CalendarEvent[]> => {
  if (!userIds.length) return [];

  try {
    const { data, error } = await supabase
      .from('user_events')
      .select('*')
      .in('user_id', userIds)
      .gte('start_time', format(startDate, "yyyy-MM-dd'T'00:00:00"))
      .lte('end_time', format(endDate, "yyyy-MM-dd'T'23:59:59"))
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching events for users in range:', error);
      return [];
    }

    return formatEventData(data || []);
  } catch (error) {
    console.error('Exception in fetchEventsForUsersInRange:', error);
    return [];
  }
};
