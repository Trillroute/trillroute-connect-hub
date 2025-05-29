
import { supabase } from '@/integrations/supabase/client';

/**
 * Simple event type to avoid complex type inference
 */
interface SimpleEventData {
  id: string;
  title: string;
  description?: string;
  event_type: string;
  start_time: string;
  end_time: string;
  is_blocked?: boolean;
  metadata?: any;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

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
      const filteredData = (allEventsResult.data as SimpleEventData[] || []).filter((event) => {
        if (!event.metadata || typeof event.metadata !== 'object') return false;
        const metadataValue = (event.metadata as any)[columnName];
        return metadataValue && values.includes(metadataValue);
      });

      console.log(`Found ${filteredData.length} events for ${columnName} in [${values.join(', ')}]`);
      
      // Format the data with explicit typing to avoid circular imports
      const events = filteredData.map((event) => ({
        id: event.id,
        title: event.title,
        description: event.description,
        eventType: event.event_type,
        start: new Date(event.start_time),
        end: new Date(event.end_time),
        isBlocked: event.is_blocked || false,
        metadata: event.metadata,
        userId: event.user_id,
        user_id: event.user_id,
        start_time: event.start_time,
        end_time: event.end_time,
        location: (event.metadata && typeof event.metadata === 'object' && 'location' in event.metadata) 
          ? String(event.metadata.location) 
          : undefined,
        color: (event.metadata && typeof event.metadata === 'object' && 'color' in event.metadata) 
          ? String(event.metadata.color) 
          : undefined,
        created_at: event.created_at,
        updated_at: event.updated_at
      }));

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
    
    // Format the data with explicit typing to avoid circular imports
    const events = (data as SimpleEventData[] || []).map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      eventType: event.event_type,
      start: new Date(event.start_time),
      end: new Date(event.end_time),
      isBlocked: event.is_blocked || false,
      metadata: event.metadata,
      userId: event.user_id,
      user_id: event.user_id,
      start_time: event.start_time,
      end_time: event.end_time,
      location: (event.metadata && typeof event.metadata === 'object' && 'location' in event.metadata) 
        ? String(event.metadata.location) 
        : undefined,
      color: (event.metadata && typeof event.metadata === 'object' && 'color' in event.metadata) 
        ? String(event.metadata.color) 
        : undefined,
      created_at: event.created_at,
      updated_at: event.updated_at
    }));

    return events;
  } catch (error) {
    console.error(`Exception in fetchEventsByMultipleValues for ${columnName}:`, error);
    return [];
  }
};
