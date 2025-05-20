
import { supabase } from '@/integrations/supabase/client';
import { CalendarEvent, UserEventFromDB } from '../../types/eventTypes';

/**
 * Fetch events based on multiple filter criteria
 * 
 * @param filters Object containing column names as keys and filter values
 * @returns Array of event objects or empty array if none found
 */
export async function fetchEventsByMultipleValues(filters: Record<string, any>): Promise<CalendarEvent[]> {
  try {
    console.log('Fetching events with multiple filters:', filters);
    
    // Use explicit typing for the query to avoid excessive type instantiation
    let query = supabase.from('user_events').select('*');
    
    // Apply each filter to the query
    for (const [column, value] of Object.entries(filters)) {
      query = query.eq(column, value);
    }
    
    const { data, error } = await query as { data: UserEventFromDB[] | null, error: any };
    
    if (error) {
      console.error('Error fetching events by multiple values:', error);
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
    console.error('Exception in fetchEventsByMultipleValues:', error);
    return [];
  }
}
