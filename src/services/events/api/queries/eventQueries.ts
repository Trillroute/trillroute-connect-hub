
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

    const events = (response.data || []) as CalendarEvent[];
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
    const response = await supabase
      .from('calendar_events')
      .select('*')
      .eq(columnName, filterId);
    
    if (response.error) {
      console.error(`Error fetching events for ${filterType} with ID ${filterId}:`, response.error);
      return [];
    }

    const events = (response.data || []) as CalendarEvent[];
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
    const response = await supabase
      .from('calendar_events')
      .select('*')
      .in(columnName, filterIds);
    
    if (response.error) {
      console.error(`Error fetching events for ${filterType} with multiple IDs:`, response.error);
      return [];
    }

    const events = (response.data || []) as CalendarEvent[];
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
    const { data, error } = await supabase
      .from('user_events')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching user events:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Map to calendar events with explicit typing
    return data.map((event: UserEventFromDB): CalendarEvent => {
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
        if (metadata.color) calendarEvent.color = metadata.color as string;
        if (metadata.location) calendarEvent.location = metadata.location as string;
      }
      
      return calendarEvent;
    });
  } catch (error) {
    console.error('Error in fetchUserEvents:', error);
    return [];
  }
}
