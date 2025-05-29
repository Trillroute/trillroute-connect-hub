
import { supabase } from '@/integrations/supabase/client';
import { CalendarEvent } from '../types/eventTypes';

/**
 * Fetch all events from the database
 */
export async function fetchAllEvents(): Promise<CalendarEvent[]> {
  try {
    const { data, error } = await supabase
      .from('user_events')
      .select('*')
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching all events:', error);
      return [];
    }

    return mapToCalendarEvents(data || []);
  } catch (error) {
    console.error('Exception in fetchAllEvents:', error);
    return [];
  }
}

/**
 * Fetch events by a single filter value
 */
export async function fetchEventsBySingleValue(columnName: string, value: string): Promise<CalendarEvent[]> {
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
    return mapToCalendarEvents(data || []);
  } catch (error) {
    console.error(`Exception in fetchEventsBySingleValue for ${columnName}:`, error);
    return [];
  }
}

/**
 * Fetch events by multiple filter values
 */
export async function fetchEventsByMultipleValues(columnName: string, values: string[]): Promise<CalendarEvent[]> {
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
      return mapToCalendarEvents(filteredData);
    }
    
    const { data, error } = await query.order('start_time', { ascending: true });

    if (error) {
      console.error(`Error fetching events by ${columnName}:`, error);
      return [];
    }

    console.log(`Found ${data?.length || 0} events for ${columnName} in [${values.join(', ')}]`);
    return mapToCalendarEvents(data || []);
  } catch (error) {
    console.error(`Exception in fetchEventsByMultipleValues for ${columnName}:`, error);
    return [];
  }
}

/**
 * Fetch events for specific users
 */
export async function fetchUserEvents(userIds: string[]): Promise<CalendarEvent[]> {
  if (userIds.length === 0) return [];
  
  try {
    const { data, error } = await supabase
      .from('user_events')
      .select('*')
      .in('user_id', userIds)
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching user events:', error);
      return [];
    }

    return mapToCalendarEvents(data || []);
  } catch (error) {
    console.error('Exception in fetchUserEvents:', error);
    return [];
  }
}

/**
 * Map database events to CalendarEvent format
 */
function mapToCalendarEvents(events: any[]): CalendarEvent[] {
  return events.map(event => ({
    id: event.id,
    title: event.title,
    description: event.description || '',
    eventType: event.event_type || 'general',
    start: new Date(event.start_time),
    end: new Date(event.end_time),
    isBlocked: event.is_blocked || false,
    metadata: event.metadata || {},
    userId: event.user_id,
    user_id: event.user_id,
    start_time: event.start_time,
    end_time: event.end_time,
    location: (event.metadata && typeof event.metadata === 'object' && 'location' in event.metadata) 
      ? String(event.metadata.location) 
      : undefined,
    color: (event.metadata && typeof event.metadata === 'object' && 'color' in event.metadata) 
      ? String(event.metadata.color) 
      : '#10B981', // Default green color for class events
    created_at: event.created_at,
    updated_at: event.updated_at
  }));
}
