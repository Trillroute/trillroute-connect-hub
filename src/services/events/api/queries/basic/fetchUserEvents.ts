
import { supabase } from '@/integrations/supabase/client';

/**
 * Simple event interface to avoid circular imports
 */
interface SimpleEvent {
  id: string;
  title: string;
  description?: string;
  eventType: string;
  start: Date;
  end: Date;
  isBlocked?: boolean;
  metadata?: any;
  userId: string;
  user_id: string;
  start_time: string;
  end_time: string;
  location?: string;
  color?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Fetch events for specific users (accepts both single user ID and array of user IDs)
 */
export const fetchUserEvents = async (userIds: string | string[]): Promise<SimpleEvent[]> => {
  try {
    const userIdsArray = Array.isArray(userIds) ? userIds : [userIds];
    
    const { data, error } = await supabase
      .from('user_events')
      .select('*')
      .in('user_id', userIdsArray)
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching user events:', error);
      return [];
    }

    // Format the data manually to avoid circular imports
    return (data || []).map(event => ({
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
  } catch (error) {
    console.error('Exception in fetchUserEvents:', error);
    return [];
  }
};
