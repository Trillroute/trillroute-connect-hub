
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetch events by multiple filter values
 */
export const fetchEventsByMultipleValues = async (columnName: string, values: string[]) => {
  try {
    console.log(`Fetching events by ${columnName} in [${values.join(', ')}]`);
    
    let allEvents: any[] = [];
    
    // Handle different filter types
    if (columnName === 'user_id') {
      // For user_id, get both events they own AND events where they appear in metadata
      const ownEventsQuery = supabase.from('user_events').select('*').in('user_id', values);
      
      // Build OR conditions for metadata filtering
      const metadataConditions = values.map(value => 
        `metadata->>teacherId.eq.${value},metadata->>studentId.eq.${value}`
      ).join(',');
      
      const metadataEventsQuery = supabase.from('user_events').select('*').or(metadataConditions);
      
      const [ownEventsResult, metadataEventsResult] = await Promise.all([
        ownEventsQuery.order('start_time', { ascending: true }),
        metadataEventsQuery.order('start_time', { ascending: true })
      ]);
      
      if (ownEventsResult.error) {
        console.error(`Error fetching own events:`, ownEventsResult.error);
        return [];
      }
      
      if (metadataEventsResult.error) {
        console.error(`Error fetching metadata events:`, metadataEventsResult.error);
        return [];
      }
      
      // Combine and deduplicate events
      const combinedEvents = [...(ownEventsResult.data || []), ...(metadataEventsResult.data || [])];
      const uniqueEvents = combinedEvents.filter((event, index, self) => 
        index === self.findIndex(e => e.id === event.id)
      );
      
      allEvents = uniqueEvents;
    } else if (columnName === 'course_id' || columnName === 'skill_id' || columnName === 'teacher_id' || columnName === 'student_id') {
      // For metadata-based filtering with multiple values, fetch all events and filter in JavaScript
      const result = await supabase.from('user_events').select('*').order('start_time', { ascending: true });
      
      if (result.error) {
        console.error(`Error fetching events for ${columnName} filtering:`, result.error);
        return [];
      }

      // Filter events where metadata contains any of the specified values
      const filteredData = [];
      const allData = result.data || [];
      
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

      allEvents = filteredData;
    } else {
      // Default case - return empty array
      return [];
    }

    console.log(`Found ${allEvents.length} events for ${columnName} in [${values.join(', ')}]`);
    
    // Transform events
    const events = [];
    
    for (let i = 0; i < allEvents.length; i++) {
      const event = allEvents[i];
      if (!event) continue;
      
      const transformedEvent: any = {
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
        updated_at: event.updated_at,
        location: undefined,
        color: undefined
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
    console.error(`Exception in fetchEventsByMultipleValues for ${columnName}:`, error);
    return [];
  }
};
