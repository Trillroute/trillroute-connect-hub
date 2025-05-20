
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
      userId: item.user_id
    });
  }
  
  return events;
};
