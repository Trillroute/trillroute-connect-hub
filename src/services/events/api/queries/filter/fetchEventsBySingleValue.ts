import { supabase } from '@/integrations/supabase/client';
import { CalendarEvent } from '../types/eventTypes';

/**
 * Fetch events where a specific column matches a single value
 * 
 * @param columnName The column name to filter by
 * @param value The value to match against the column
 * @returns Array of event objects or empty array if none found
 */
export async function fetchEventsBySingleValue(
  columnName: string,
  value: any
): Promise<CalendarEvent[]> {
  try {
    console.log(`Fetching events where ${columnName} = ${value}`);
    
    // Use explicit typing for the query to avoid excessive type instantiation
    const { data, error } = await supabase
      .from('user_events')
      .select('*')
      .eq(columnName, value);
    
    if (error) {
      console.error('Error fetching events by single value:', error);
      return [];
    }
    
    // Transform database results to CalendarEvent objects
    return (data || []).map(event => ({
      id: event.id,
      title: event.title,
      description: event.description || undefined,
      eventType: event.event_type,
      start: new Date(event.start_time),
      end: new Date(event.end_time),
      isBlocked: event.is_blocked,
      metadata: event.metadata,
      userId: event.user_id,
      start_time: event.start_time,
      end_time: event.end_time,
      user_id: event.user_id,
      // Other fields like location and color might be in metadata
      location: (event.metadata && typeof event.metadata === 'object' && 'location' in event.metadata) 
        ? String(event.metadata.location) 
        : undefined,
      color: (event.metadata && typeof event.metadata === 'object' && 'color' in event.metadata) 
        ? String(event.metadata.color) 
        : undefined,
      created_at: event.created_at,
      updated_at: event.updated_at
    }));
  } catch (error) {
    console.error('Exception in fetchEventsBySingleValue:', error);
    return [];
  }
}
