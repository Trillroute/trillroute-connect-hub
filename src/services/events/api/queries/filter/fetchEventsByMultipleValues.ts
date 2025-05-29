
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetch events by multiple filter values
 */
export const fetchEventsByMultipleValues = async (columnName: string, values: string[]) => {
  try {
    console.log(`Fetching events by ${columnName} in [${values.join(', ')}]`);
    
    // Use the most basic approach possible to avoid type inference issues
    let queryResult;
    
    // Handle different filter types
    if (columnName === 'user_id') {
      queryResult = await supabase
        .from('user_events')
        .select('*')
        .in('user_id', values)
        .order('start_time', { ascending: true });
    } else if (columnName === 'course_id' || columnName === 'skill_id' || columnName === 'teacher_id' || columnName === 'student_id') {
      // For metadata-based filtering with multiple values, fetch all events and filter in JavaScript
      queryResult = await supabase
        .from('user_events')
        .select('*')
        .order('start_time', { ascending: true });

      const error = queryResult?.error;
      const allData = queryResult?.data;

      if (error) {
        console.error(`Error fetching events for ${columnName} filtering:`, error);
        return [];
      }

      // Filter events where metadata contains any of the specified values
      const filteredData = [];
      
      if (allData && Array.isArray(allData)) {
        for (let i = 0; i < allData.length; i++) {
          const event = allData[i];
          if (!event) continue;
          
          const metadata = event.metadata;
          if (!metadata || typeof metadata !== 'object') continue;
          
          const metadataValue = metadata[columnName];
          if (metadataValue && values.includes(metadataValue)) {
            filteredData.push(event);
          }
        }
      }

      console.log(`Found ${filteredData.length} events for ${columnName} in [${values.join(', ')}]`);
      
      // Transform the filtered data
      const events = [];
      
      for (let i = 0; i < filteredData.length; i++) {
        const event = filteredData[i];
        if (!event) continue;
        
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
    } else {
      // Default case - return empty array
      return [];
    }

    // Extract data and error without destructuring to avoid type issues
    const error = queryResult?.error;
    const data = queryResult?.data;

    if (error) {
      console.error(`Error fetching events by ${columnName}:`, error);
      return [];
    }

    console.log(`Found ${data?.length || 0} events for ${columnName} in [${values.join(', ')}]`);
    
    // Check if we have valid data
    if (!data) {
      return [];
    }

    if (!Array.isArray(data)) {
      return [];
    }

    const events = [];
    
    for (let i = 0; i < data.length; i++) {
      const event = data[i];
      if (!event) continue;
      
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
    console.error(`Exception in fetchEventsByMultipleValues for ${columnName}:`, error);
    return [];
  }
};
