
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetch events by a single filter value
 */
export const fetchEventsBySingleValue = async (columnName: string, value: string) => {
  try {
    console.log(`Fetching events by ${columnName} = ${value}`);
    
    // Use the most basic approach possible to avoid type inference issues
    let queryResult: any;
    
    // Handle different filter types
    if (columnName === 'user_id') {
      queryResult = await supabase
        .from('user_events')
        .select('*')
        .eq('user_id', value)
        .order('start_time', { ascending: true });
    } else if (columnName === 'course_id' || columnName === 'skill_id' || columnName === 'teacher_id' || columnName === 'student_id') {
      // For metadata-based filtering, use the metadata column
      queryResult = await supabase
        .from('user_events')
        .select('*')
        .eq(`metadata->${columnName}`, value)
        .order('start_time', { ascending: true });
    } else {
      // Default case - return empty array
      return [];
    }

    // Extract data and error without destructuring
    const error = queryResult.error;
    const data = queryResult.data;

    if (error) {
      console.error(`Error fetching events by ${columnName}:`, error);
      return [];
    }

    console.log(`Found ${data?.length || 0} events for ${columnName} = ${value}`);
    
    // Check if we have valid data
    if (!data) {
      return [];
    }

    if (!Array.isArray(data)) {
      return [];
    }

    const events: any[] = [];
    
    // Process each event individually
    for (let i = 0; i < data.length; i++) {
      const event = data[i];
      if (!event) continue;
      
      // Create transformed event object
      const transformedEvent: any = {};
      
      // Basic properties
      transformedEvent.id = event.id;
      transformedEvent.title = event.title;
      transformedEvent.description = event.description;
      transformedEvent.eventType = event.event_type;
      transformedEvent.start = new Date(event.start_time);
      transformedEvent.end = new Date(event.end_time);
      transformedEvent.isBlocked = Boolean(event.is_blocked);
      transformedEvent.metadata = event.metadata || {};
      transformedEvent.userId = event.user_id;
      transformedEvent.user_id = event.user_id;
      transformedEvent.start_time = event.start_time;
      transformedEvent.end_time = event.end_time;
      transformedEvent.created_at = event.created_at;
      transformedEvent.updated_at = event.updated_at;

      // Handle metadata properties
      const metadata = event.metadata;
      if (metadata && typeof metadata === 'object') {
        const location = metadata.location;
        const color = metadata.color;
        
        if (location) {
          transformedEvent.location = String(location);
        }
        if (color) {
          transformedEvent.color = String(color);
        }
      }

      events.push(transformedEvent);
    }

    return events;
  } catch (error) {
    console.error(`Exception in fetchEventsBySingleValue for ${columnName}:`, error);
    return [];
  }
};
