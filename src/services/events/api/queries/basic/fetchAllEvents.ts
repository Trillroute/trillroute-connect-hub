
import { supabase } from '@/integrations/supabase/client';
import { CalendarEvent } from '../../types/eventTypes';
import { formatEventData } from '../utils/eventFormatters';

/**
 * Fetch all calendar events from the database
 */
export const fetchAllEvents = async (): Promise<CalendarEvent[]> => {
  try {
    const { data, error } = await supabase
      .from('user_events')
      .select('*')
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching events:', error);
      return [];
    }

    return formatEventData(data || []);
  } catch (error) {
    console.error('Exception in fetchAllEvents:', error);
    return [];
  }
};
