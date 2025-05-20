
import { supabase } from '@/integrations/supabase/client';
import { CalendarEvent } from '../../types/eventTypes';
import { formatEventData } from '../utils/eventFormatters';

/**
 * Fetch events for a specific user
 */
export const fetchUserEvents = async (userId: string): Promise<CalendarEvent[]> => {
  try {
    const { data, error } = await supabase
      .from('user_events')
      .select('*')
      .eq('user_id', userId)
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching user events:', error);
      return [];
    }

    return formatEventData(data || []);
  } catch (error) {
    console.error('Exception in fetchUserEvents:', error);
    return [];
  }
};
