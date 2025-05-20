
import { supabase } from '@/integrations/supabase/client';
import { CalendarEvent } from '../types/eventTypes';
import { format } from 'date-fns';

/**
 * Fetch all calendar events from the database
 */
export const fetchAllEvents = async (): Promise<CalendarEvent[]> => {
  try {
    const { data, error } = await supabase
      .from('user_events')
      .select('*')
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching events:', error);
      return [];
    }

    // Create array of typed calendar events
    const events: CalendarEvent[] = [];
    
    // Populate events array from data
    for (let i = 0; i < (data?.length || 0); i++) {
      const item = data?.[i];
      if (!item) continue;
      
      events.push({
        id: item.id,
        title: item.title || '',
        description: item.description || '',
        eventType: item.event_type || 'general',
        start: new Date(item.start_time),
        end: new Date(item.end_time),
        isBlocked: item.is_blocked || false,
        metadata: item.metadata || {},
        userId: item.user_id
      });
    }

    return events;
  } catch (error) {
    console.error('Exception in fetchAllEvents:', error);
    return [];
  }
};

/**
 * Fetch events for a specific user
 */
export const fetchUserEvents = async (userId: string): Promise<CalendarEvent[]> => {
  try {
    const { data, error } = await supabase
      .from('user_events')
      .select('*')
      .eq('user_id', userId)
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching user events:', error);
      return [];
    }

    // Create array of typed calendar events
    const events: CalendarEvent[] = [];
    
    // Populate events array from data
    for (let i = 0; i < (data?.length || 0); i++) {
      const item = data?.[i];
      if (!item) continue;
      
      events.push({
        id: item.id,
        title: item.title || '',
        description: item.description || '',
        eventType: item.event_type || 'general',
        start: new Date(item.start_time),
        end: new Date(item.end_time),
        isBlocked: item.is_blocked || false,
        metadata: item.metadata || {},
        userId: item.user_id
      });
    }

    return events;
  } catch (error) {
    console.error('Exception in fetchUserEvents:', error);
    return [];
  }
};

/**
 * Fetch events within a date range for all users or a specific user
 */
export const fetchEventsInRange = async (
  startDate: Date,
  endDate: Date,
  userId?: string
): Promise<CalendarEvent[]> => {
  try {
    let query = supabase
      .from('user_events')
      .select('*')
      .gte('start_time', format(startDate, "yyyy-MM-dd'T'00:00:00"))
      .lte('end_time', format(endDate, "yyyy-MM-dd'T'23:59:59"))
      .order('start_time', { ascending: true });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching events in range:', error);
      return [];
    }

    // Create array of typed calendar events
    const events: CalendarEvent[] = [];
    
    // Populate events array from data
    for (let i = 0; i < (data?.length || 0); i++) {
      const item = data?.[i];
      if (!item) continue;
      
      events.push({
        id: item.id,
        title: item.title || '',
        description: item.description || '',
        eventType: item.event_type || 'general',
        start: new Date(item.start_time),
        end: new Date(item.end_time),
        isBlocked: item.is_blocked || false,
        metadata: item.metadata || {},
        userId: item.user_id
      });
    }

    return events;
  } catch (error) {
    console.error('Exception in fetchEventsInRange:', error);
    return [];
  }
};

/**
 * Fetch events for specific users within a date range
 */
export const fetchEventsForUsersInRange = async (
  userIds: string[],
  startDate: Date,
  endDate: Date
): Promise<CalendarEvent[]> => {
  if (!userIds.length) return [];

  try {
    const { data, error } = await supabase
      .from('user_events')
      .select('*')
      .in('user_id', userIds)
      .gte('start_time', format(startDate, "yyyy-MM-dd'T'00:00:00"))
      .lte('end_time', format(endDate, "yyyy-MM-dd'T'23:59:59"))
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching events for users in range:', error);
      return [];
    }

    // Create array of typed calendar events
    const events: CalendarEvent[] = [];
    
    // Populate events array from data
    for (let i = 0; i < (data?.length || 0); i++) {
      const item = data?.[i];
      if (!item) continue;
      
      events.push({
        id: item.id,
        title: item.title || '',
        description: item.description || '',
        eventType: item.event_type || 'general',
        start: new Date(item.start_time),
        end: new Date(item.end_time),
        isBlocked: item.is_blocked || false,
        metadata: item.metadata || {},
        userId: item.user_id
      });
    }

    return events;
  } catch (error) {
    console.error('Exception in fetchEventsForUsersInRange:', error);
    return [];
  }
};

/**
 * Fetch all events for multiple users
 */
export const fetchEventsForUsers = async (
  userIds: string[]
): Promise<CalendarEvent[]> => {
  if (!userIds.length) return [];

  try {
    const { data, error } = await supabase
      .from('user_events')
      .select('*')
      .in('user_id', userIds)
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching events for users:', error);
      return [];
    }

    // Create array of typed calendar events
    const events: CalendarEvent[] = [];
    
    // Populate events array from data
    for (let i = 0; i < (data?.length || 0); i++) {
      const item = data?.[i];
      if (!item) continue;
      
      events.push({
        id: item.id,
        title: item.title || '',
        description: item.description || '',
        eventType: item.event_type || 'general',
        start: new Date(item.start_time),
        end: new Date(item.end_time),
        isBlocked: item.is_blocked || false,
        metadata: item.metadata || {},
        userId: item.user_id
      });
    }

    return events;
  } catch (error) {
    console.error('Exception in fetchEventsForUsers:', error);
    return [];
  }
};

/**
 * Fetch events by a single value for a specific column
 */
export const fetchEventsBySingleValue = async (
  columnName: string,
  filterType: string,
  value: string
): Promise<CalendarEvent[]> => {
  try {
    const { data, error } = await supabase
      .from('user_events')
      .select('*')
      .eq(columnName, value)
      .order('start_time', { ascending: true });

    if (error) {
      console.error(`Error fetching events by ${columnName}:`, error);
      return [];
    }

    // Create array of typed calendar events
    const events: CalendarEvent[] = [];
    
    // Populate events array from data
    for (let i = 0; i < (data?.length || 0); i++) {
      const item = data?.[i];
      if (!item) continue;
      
      events.push({
        id: item.id,
        title: item.title || '',
        description: item.description || '',
        eventType: item.event_type || 'general',
        start: new Date(item.start_time),
        end: new Date(item.end_time),
        isBlocked: item.is_blocked || false,
        metadata: item.metadata || {},
        userId: item.user_id
      });
    }

    return events;
  } catch (error) {
    console.error(`Exception in fetchEventsBySingleValue for ${columnName}:`, error);
    return [];
  }
};

/**
 * Fetch events by multiple values for a specific column
 */
export const fetchEventsByMultipleValues = async (
  columnName: string,
  filterType: string,
  values: string[]
): Promise<CalendarEvent[]> => {
  try {
    const { data, error } = await supabase
      .from('user_events')
      .select('*')
      .in(columnName, values)
      .order('start_time', { ascending: true });

    if (error) {
      console.error(`Error fetching events by multiple ${columnName} values:`, error);
      return [];
    }

    // Create array of typed calendar events
    const events: CalendarEvent[] = [];
    
    // Populate events array from data
    for (let i = 0; i < (data?.length || 0); i++) {
      const item = data?.[i];
      if (!item) continue;
      
      events.push({
        id: item.id,
        title: item.title || '',
        description: item.description || '',
        eventType: item.event_type || 'general',
        start: new Date(item.start_time),
        end: new Date(item.end_time),
        isBlocked: item.is_blocked || false,
        metadata: item.metadata || {},
        userId: item.user_id
      });
    }

    return events;
  } catch (error) {
    console.error(`Exception in fetchEventsByMultipleValues for ${columnName}:`, error);
    return [];
  }
};
