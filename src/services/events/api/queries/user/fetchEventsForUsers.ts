
import { supabase } from '@/integrations/supabase/client';
import { CalendarEvent } from '../../types/eventTypes';
import { formatEventData } from '../utils/eventFormatters';

/**
 * Fetch all events for multiple users
 */
export const fetchEventsForUsers = async (
  userIds: string[]
): Promise<CalendarEvent[]> => {
  if (!userIds.length) return [];

  try {
    const { data, error } = await supabase
      .from('user_events')
      .select('*')
      .in('user_id', userIds)
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching events for users:', error);
      return [];
    }

    return formatEventData(data || []);
  } catch (error) {
    console.error('Exception in fetchEventsForUsers:', error);
    return [];
  }
};
