
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
    // Explicitly destructure data and error to avoid type recursion
    const result = await supabase
      .from('calendar_events')
      .select('*')
      .eq(columnName, filterId);
    
    // Handle error case
    if (result.error) {
      console.error(`Error fetching events for ${filterType} with ID ${filterId}:`, result.error);
      return [];
    }

    // Safely cast the data using an intermediate array
    const rawData = result.data || [];
    const events: CalendarEvent[] = [];
    
    // Process each item individually to avoid deep type instantiation
    rawData.forEach(item => {
      events.push(item as CalendarEvent);
    });
    
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
    // Explicitly destructure data and error to avoid type recursion
    const result = await supabase
      .from('calendar_events')
      .select('*')
      .in(columnName, filterIds);
    
    // Handle error case
    if (result.error) {
      console.error(`Error fetching events for ${filterType} with multiple IDs:`, result.error);
      return [];
    }

    // Safely cast the data using an intermediate array
    const rawData = result.data || [];
    const events: CalendarEvent[] = [];
    
    // Process each item individually to avoid deep type instantiation
    rawData.forEach(item => {
      events.push(item as CalendarEvent);
    });
    
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
    const result = await supabase
      .from('user_events')
      .select('*')
      .eq('user_id', userId);
    
    if (result.error) {
      console.error('Error fetching user events:', result.error);
      return [];
    }
    
    if (!result.data || result.data.length === 0) {
      return [];
    }
    
    // Map to calendar events with explicit typing
    const events: CalendarEvent[] = [];
    
    result.data.forEach((event: UserEventFromDB) => {
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
      
      events.push(calendarEvent);
    });
    
    return events;
  } catch (error) {
    console.error('Error in fetchUserEvents:', error);
    return [];
  }
}
