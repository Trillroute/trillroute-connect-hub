
import { UserEventFromDB, CalendarEvent } from '../../types/eventTypes';

/**
 * Format database event data into CalendarEvent objects
 */
export const formatEventData = (data: UserEventFromDB[]): CalendarEvent[] => {
  const events: CalendarEvent[] = [];
  
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
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
      userId: item.user_id,
      user_id: item.user_id,
      start_time: item.start_time,
      end_time: item.end_time,
      location: (item.metadata && typeof item.metadata === 'object' && 'location' in item.metadata) 
        ? String(item.metadata.location) 
        : undefined,
      color: (item.metadata && typeof item.metadata === 'object' && 'color' in item.metadata) 
        ? String(item.metadata.color) 
        : undefined,
      created_at: item.created_at,
      updated_at: item.updated_at
    });
  }
  
  return events;
};
