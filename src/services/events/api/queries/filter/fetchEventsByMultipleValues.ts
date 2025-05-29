
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetch events by multiple filter values
 */
export const fetchEventsByMultipleValues = async (columnName: string, values: string[]) => {
  try {
    console.log(`Fetching events by ${columnName} in [${values.join(', ')}]`);
    
    // Explicitly type everything to avoid complex type inference
    let data: any = null;
    let error: any = null;
    
    // Handle different filter types
    if (columnName === 'user_id') {
      const result = await supabase
        .from('user_events')
        .select('*')
        .in('user_id', values)
        .order('start_time', { ascending: true });
      data = result.data;
      error = result.error;
    } else if (columnName === 'course_id' || columnName === 'skill_id' || columnName === 'teacher_id' || columnName === 'student_id') {
      // For metadata-based filtering with multiple values, we need to use OR conditions
      // This is more complex, so we'll fetch all events and filter in JavaScript
      const allEventsResult = await supabase
        .from('user_events')
        .select('*')
        .order('start_time', { ascending: true });

      if (allEventsResult.error) {
        console.error(`Error fetching events for ${columnName} filtering:`, allEventsResult.error);
        return [];
      }

      // Filter events where metadata contains any of the specified values
      const filteredData: any[] = [];
      const allData = allEventsResult.data || [];
      
      for (const event of allData) {
        if (!event || !event.metadata || typeof event.metadata !== 'object') continue;
        
        const metadataValue = event.metadata[columnName];
        if (metadataValue && values.includes(metadataValue)) {
          filteredData.push(event);
        }
      }

      console.log(`Found ${filteredData.length} events for ${columnName} in [${values.join(', ')}]`);
      
      // Transform the filtered data
      const events: any[] = [];
      
      for (const event of filteredData) {
        if (!event) continue;
        
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

        // Add location and color separately
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
    } else {
      // Default case - return empty array
      return [];
    }

    if (error) {
      console.error(`Error fetching events by ${columnName}:`, error);
      return [];
    }

    console.log(`Found ${data?.length || 0} events for ${columnName} in [${values.join(', ')}]`);
    
    // Simplify the data transformation to avoid deep type inference
    if (!data || !Array.isArray(data)) {
      return [];
    }

    const events: any[] = [];
    
    for (const event of data) {
      if (!event) continue;
      
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

      // Add location and color separately
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
    console.error(`Exception in fetchEventsByMultipleValues for ${columnName}:`, error);
    return [];
  }
};
