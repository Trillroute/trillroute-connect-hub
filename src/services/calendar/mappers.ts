
import { CalendarEvent } from "@/components/admin/scheduling/types";
import { DbEvent } from "./types";

// Convert between frontend CalendarEvent and database event format
export const mapToDbEvent = (event: Omit<CalendarEvent, "id">, userId: string): Omit<DbEvent, "id"> => ({
  title: event.title,
  description: event.description || null,
  location: event.location || null,
  start_time: event.start.toISOString(),
  end_time: event.end.toISOString(),
  color: event.color || null,
  user_id: userId
});

export const mapFromDbEvent = (dbEvent: DbEvent): CalendarEvent => ({
  id: dbEvent.id,
  title: dbEvent.title,
  description: dbEvent.description,
  location: dbEvent.location,
  start: new Date(dbEvent.start_time),
  end: new Date(dbEvent.end_time),
  color: dbEvent.color,
});
