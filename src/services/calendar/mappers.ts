
import { CalendarEvent } from "@/components/admin/scheduling/types";

export interface DbEvent {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  event_type: string;
  is_blocked?: boolean;
  metadata?: any;
  created_at?: string;
  updated_at?: string;
  location?: string;
  color?: string;
}

export const mapToDbEvent = (event: Omit<CalendarEvent, "id">, userId: string): Omit<DbEvent, "id" | "created_at" | "updated_at"> => {
  return {
    user_id: userId,
    title: event.title,
    description: event.description,
    start_time: event.start.toISOString(),
    end_time: event.end.toISOString(),
    event_type: event.eventType || 'general',
    is_blocked: event.isBlocked || false,
    metadata: {
      ...event.metadata,
      location: event.location,
      color: event.color
    }
  };
};

export const mapFromDbEvent = (dbEvent: DbEvent): CalendarEvent => {
  return {
    id: dbEvent.id,
    title: dbEvent.title,
    description: dbEvent.description || '',
    start: new Date(dbEvent.start_time),
    end: new Date(dbEvent.end_time),
    userId: dbEvent.user_id,
    eventType: dbEvent.event_type || 'general',
    isBlocked: dbEvent.is_blocked || false,
    metadata: dbEvent.metadata || {},
    user_id: dbEvent.user_id,
    start_time: dbEvent.start_time,
    end_time: dbEvent.end_time,
    location: dbEvent.location || (dbEvent.metadata && typeof dbEvent.metadata === 'object' && 'location' in dbEvent.metadata) 
      ? String(dbEvent.metadata.location) 
      : undefined,
    color: dbEvent.color || (dbEvent.metadata && typeof dbEvent.metadata === 'object' && 'color' in dbEvent.metadata) 
      ? String(dbEvent.metadata.color) 
      : '#4285F4',
    created_at: dbEvent.created_at,
    updated_at: dbEvent.updated_at
  };
};
