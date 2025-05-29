
import { supabase } from '@/integrations/supabase/client';
import { formatEventData } from '../utils/eventFormatters';

// Define CalendarEvent interface locally to avoid circular imports
interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  eventType?: string;
  start: Date;
  end: Date;
  isBlocked?: boolean;
  metadata?: any;
  userId: string;
  user_id: string;
  start_time: string;
  end_time: string;
  location?: string;
  color?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Fetch events by multiple filter values
 */
export const fetchEventsByMultipleValues = async (columnName: string, values: string[]): Promise<CalendarEvent[]> => {
  try {
    console.log(`Fetching events by ${columnName} in [${values.join(', ')}]`);
    
    let query = supabase.from('user_events').select('*');
    
    // Handle different filter types
    if (columnName === 'user_id') {
      query = query.in('user_id', values);
    } else if (columnName === 'course_id' || columnName === 'skill_id' || columnName === 'teacher_id' || columnName === 'student_id') {
      // For metadata-based filtering with multiple values, we need to use OR conditions
      // This is more complex, so we'll fetch all events and filter in JavaScript
      const { data, error } = await supabase
        .from('user_events')
        .select('*')
        .order('start_time', { ascending: true });

      if (error) {
        console.error(`Error fetching events for ${columnName} filtering:`, error);
        return [];
      }

      // Filter events where metadata contains any of the specified values
      const filteredData = (data || []).filter(event => {
        if (!event.metadata || typeof event.metadata !== 'object') return false;
        const metadataValue = (event.metadata as any)[columnName];
        return metadataValue && values.includes(metadataValue);
      });

      console.log(`Found ${filteredData.length} events for ${columnName} in [${values.join(', ')}]`);
      return formatEventData(filteredData);
    }
    
    const { data, error } = await query.order('start_time', { ascending: true });

    if (error) {
      console.error(`Error fetching events by ${columnName}:`, error);
      return [];
    }

    console.log(`Found ${data?.length || 0} events for ${columnName} in [${values.join(', ')}]`);
    return formatEventData(data || []);
  } catch (error) {
    console.error(`Exception in fetchEventsByMultipleValues for ${columnName}:`, error);
    return [];
  }
};
