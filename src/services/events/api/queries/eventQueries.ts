
import { supabase } from '@/integrations/supabase/client';
import { CalendarEvent, UserEventFromDB } from '../types/eventTypes';

/**
 * Fetch all calendar events with no filtering
 */
export async function fetchAllEvents(): Promise<CalendarEvent[]> {
  try {
    const response = await supabase.from('calendar_events').select('*');
    
    if (response.error) {
      console.error('Error fetching all events:', response.error);
      return [];
    }

    // Use a more direct approach to cast data
    const events = response.data as unknown as CalendarEvent[];
    console.log(`Found ${events.length} events (no filters)`);
    return events;
  } catch (error) {
    console.error('Unexpected error in fetchAllEvents:', error);
    return [];
  }
}

/**
 * Fetch events matching a single value in the specified column
 */
export async function fetchEventsBySingleValue(
  columnName: string, 
  filterType: string, 
  filterId: string
): Promise<CalendarEvent[]> {
  try {
    // Use a safer approach to avoid deep type instantiation
    const query = supabase.from('calendar_events').select('*').eq(columnName, filterId);
    const response = await query;
    
    // Handle error case
    if (response.error) {
      console.error(`Error fetching events for ${filterType} with ID ${filterId}:`, response.error);
      return [];
    }

    // Create a new array and explictly cast each element
    const events: CalendarEvent[] = [];
    if (response.data) {
      for (let i = 0; i < response.data.length; i++) {
        const item = response.data[i];
        events.push({
          id: item.id,
          title: item.title,
          start_time: item.start_time,
          end_time: item.end_time,
          description: item.description,
          user_id: item.user_id,
          location: item.location,
          color: item.color,
          created_at: item.created_at,
          updated_at: item.updated_at
        });
      }
    }
    
    console.log(`Found ${events.length} events for ${filterType} with ID ${filterId}`);
    return events;
  } catch (error) {
    console.error(`Unexpected error in fetchEventsBySingleValue:`, error);
    return [];
  }
}

/**
 * Fetch events matching multiple values in the specified column
 */
export async function fetchEventsByMultipleValues(
  columnName: string, 
  filterType: string, 
  filterIds: string[]
): Promise<CalendarEvent[]> {
  try {
    // Use a safer approach to avoid deep type instantiation
    const query = supabase.from('calendar_events').select('*').in(columnName, filterIds);
    const response = await query;
    
    // Handle error case
    if (response.error) {
      console.error(`Error fetching events for ${filterType} with multiple IDs:`, response.error);
      return [];
    }

    // Create a new array and explictly cast each element
    const events: CalendarEvent[] = [];
    if (response.data) {
      for (let i = 0; i < response.data.length; i++) {
        const item = response.data[i];
        events.push({
          id: item.id,
          title: item.title,
          start_time: item.start_time,
          end_time: item.end_time,
          description: item.description,
          user_id: item.user_id,
          location: item.location,
          color: item.color,
          created_at: item.created_at,
          updated_at: item.updated_at
        });
      }
    }
    
    console.log(`Found ${events.length} events for ${filterType}`);
    return events;
  } catch (error) {
    console.error(`Unexpected error in fetchEventsByMultipleValues:`, error);
    return [];
  }
}

/**
 * Fetch events for a specific user
 */
export async function fetchUserEvents(userId: string): Promise<CalendarEvent[]> {
  try {
    const response = await supabase
      .from('user_events')
      .select('*')
      .eq('user_id', userId);
    
    if (response.error) {
      console.error('Error fetching user events:', response.error);
      return [];
    }
    
    if (!response.data || response.data.length === 0) {
      return [];
    }
    
    // Create events array explicitly instead of using .map()
    const events: CalendarEvent[] = [];
    
    for (const event of response.data) {
      // Create a base CalendarEvent with required fields
      const calendarEvent: CalendarEvent = {
        id: event.id,
        title: event.title,
        start_time: event.start_time,
        end_time: event.end_time,
        description: event.description || '',
        user_id: event.user_id
      };
      
      // Try to extract color and location from metadata if they exist
      if (event.metadata && typeof event.metadata === 'object') {
        const metadata = event.metadata as Record<string, any>;
        if (metadata.color) calendarEvent.color = String(metadata.color);
        if (metadata.location) calendarEvent.location = String(metadata.location);
      }
      
      events.push(calendarEvent);
    }
    
    return events;
  } catch (error) {
    console.error('Error in fetchUserEvents:', error);
    return [];
  }
}
