
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetch events by a single filter value
 */
export const fetchEventsBySingleValue = async (columnName: string, value: string) => {
  try {
    console.log(`Fetching events by ${columnName} = ${value}`);
    
    // Explicitly type everything to avoid complex type inference
    let data: any = null;
    let error: any = null;
    
    // Handle different filter types
    if (columnName === 'user_id') {
      const result = await supabase
        .from('user_events')
        .select('*')
        .eq('user_id', value)
        .order('start_time', { ascending: true });
      data = result.data;
      error = result.error;
    } else if (columnName === 'course_id' || columnName === 'skill_id' || columnName === 'teacher_id' || columnName === 'student_id') {
      // For metadata-based filtering, use the metadata column
      const result = await supabase
        .from('user_events')
        .select('*')
        .eq(`metadata->${columnName}`, value)
        .order('start_time', { ascending: true });
      data = result.data;
      error = result.error;
    } else {
      // Default case - return empty array
      return [];
    }

    if (error) {
      console.error(`Error fetching events by ${columnName}:`, error);
      return [];
    }

    console.log(`Found ${data?.length || 0} events for ${columnName} = ${value}`);
    
    // Simplify the data transformation to avoid deep type inference
    if (!data || !Array.isArray(data)) {
      return [];
    }

    const events: any[] = [];
    
    // Use simple iteration instead of map to avoid type inference issues
    for (const event of data) {
      if (!event) continue;
      
      // Create a simple object without complex inline transformations
      const transformedEvent: any = {};
      
      // Add properties one by one to avoid complex object spreading
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

      // Add location and color separately to avoid complex inline checks
      if (event.metadata && typeof event.metadata === 'object') {
        if ('location' in event.metadata) {
          transformedEvent.location = String(event.metadata.location);
        }
        if ('color' in event.metadata) {
          transformedEvent.color = String(event.metadata.color);
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
