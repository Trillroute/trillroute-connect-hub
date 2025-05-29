
import { supabase } from '@/integrations/supabase/client';
import { CalendarEvent } from '../../types/eventTypes';
import { formatEventData } from '../utils/eventFormatters';

/**
 * Fetch events by a single filter value
 */
export const fetchEventsBySingleValue = async (columnName: string, value: string): Promise<CalendarEvent[]> => {
  try {
    console.log(`Fetching events by ${columnName} = ${value}`);
    
    let query = supabase.from('user_events').select('*');
    
    // Handle different filter types
    if (columnName === 'user_id') {
      query = query.eq('user_id', value);
    } else if (columnName === 'course_id' || columnName === 'skill_id' || columnName === 'teacher_id' || columnName === 'student_id') {
      // For metadata-based filtering, use the metadata column
      query = query.eq(`metadata->${columnName}`, value);
    }
    
    const { data, error } = await query.order('start_time', { ascending: true });

    if (error) {
      console.error(`Error fetching events by ${columnName}:`, error);
      return [];
    }

    console.log(`Found ${data?.length || 0} events for ${columnName} = ${value}`);
    return formatEventData(data || []);
  } catch (error) {
    console.error(`Exception in fetchEventsBySingleValue for ${columnName}:`, error);
    return [];
  }
};
