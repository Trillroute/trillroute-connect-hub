
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetch events by a single filter value
 */
export const fetchEventsBySingleValue = async (columnName: string, value: string) => {
  try {
    console.log(`Fetching events by ${columnName} = ${value}`);
    
    let allEvents: any[] = [];
    
    // Handle different filter types
    if (columnName === 'user_id') {
      // For user_id, get both events they own AND events where they appear in metadata
      
      // First query: events they own
      const ownEventsResult = await supabase
        .from('user_events')
        .select('*')
        .eq('user_id', value)
        .order('start_time', { ascending: true });
      
      if (ownEventsResult.error) {
        console.error(`Error fetching own events:`, ownEventsResult.error);
        return [];
      }
      
      // Second query: events where they appear in metadata
      const metadataEventsResult = await supabase
        .from('user_events')
        .select('*')
        .or(`metadata->>teacherId.eq.${value},metadata->>studentId.eq.${value}`)
        .order('start_time', { ascending: true });
      
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
      // For metadata-based filtering, use the metadata column
      const result = await supabase
        .from('user_events')
        .select('*')
        .eq(`metadata->${columnName}`, value)
        .order('start_time', { ascending: true });
      
      if (result.error) {
        console.error(`Error fetching events by ${columnName}:`, result.error);
        return [];
      }
      
      allEvents = result.data || [];
    } else {
      // Default case - return empty array
      return [];
    }

    console.log(`Found ${allEvents.length} events for ${columnName} = ${value}`);
    
    // Transform events
    const events = [];
    
    for (let i = 0; i < allEvents.length; i++) {
      const event = allEvents[i];
      if (!event) continue;
      
      // Create transformed event object with explicit properties
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
    console.error(`Exception in fetchEventsBySingleValue for ${columnName}:`, error);
    return [];
  }
};
