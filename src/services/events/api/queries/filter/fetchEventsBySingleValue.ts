
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetch events by a single filter value
 */
export const fetchEventsBySingleValue = async (columnName: string, value: string) => {
  try {
    console.log(`Fetching events by ${columnName} = ${value}`);
    
    // Completely avoid type inference by using basic variables
    let queryResult: any = null;
    let query: any = null;
    
    // Handle different filter types
    if (columnName === 'user_id') {
      query = supabase.from('user_events').select('*').eq('user_id', value);
      queryResult = await query.order('start_time', { ascending: true });
    } else if (columnName === 'course_id' || columnName === 'skill_id' || columnName === 'teacher_id' || columnName === 'student_id') {
      // For metadata-based filtering, use the metadata column
      query = supabase.from('user_events').select('*').eq(`metadata->${columnName}`, value);
      queryResult = await query.order('start_time', { ascending: true });
    } else {
      // Default case - return empty array
      return [];
    }

    // Extract data and error with basic property access
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

    const events = [];
    
    // Process each event individually
    for (let i = 0; i < data.length; i++) {
      const event = data[i];
      if (!event) continue;
      
      // Create transformed event object with explicit properties
      const transformedEvent = {
        id: event.id,
        title: event.title,
        description: event.description,
        eventType: event.event_type,
        start: new Date(event.start_time),
        end: new Date(event.end_time),
        isBlocked: Boolean(event.is_blocked),
        metadata: event.metadata || {},
        userId: event.user_id,
        user_id: event.user_id,
        start_time: event.start_time,
        end_time: event.end_time,
        created_at: event.created_at,
        updated_at: event.updated_at
      };

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
