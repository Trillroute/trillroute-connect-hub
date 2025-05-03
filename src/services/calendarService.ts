
import { supabase } from "@/integrations/supabase/client";
import { CalendarEvent } from "@/components/admin/scheduling/types";

// Convert between frontend CalendarEvent and database event format
export const mapToDbEvent = (event: Omit<CalendarEvent, "id">, userId: string) => ({
  title: event.title,
  description: event.description || null,
  location: event.location || null,
  start_time: event.start.toISOString(),
  end_time: event.end.toISOString(),
  color: event.color || null,
  user_id: userId
});

export const mapFromDbEvent = (dbEvent: any): CalendarEvent => ({
  id: dbEvent.id,
  title: dbEvent.title,
  description: dbEvent.description,
  location: dbEvent.location,
  start: new Date(dbEvent.start_time),
  end: new Date(dbEvent.end_time),
  color: dbEvent.color,
});

export const fetchEvents = async (userId: string): Promise<CalendarEvent[]> => {
  try {
    const { data, error } = await supabase
      .from("calendar_events")
      .select("*")
      .eq("user_id", userId);
      
    if (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
    
    return data ? data.map(mapFromDbEvent) : [];
  } catch (err) {
    console.error("Failed to fetch events:", err);
    return [];
  }
};

export const createEvent = async (event: Omit<CalendarEvent, "id">, userId: string): Promise<CalendarEvent | null> => {
  try {
    const { data, error } = await supabase
      .from("calendar_events")
      .insert(mapToDbEvent(event, userId))
      .select()
      .single();
      
    if (error) {
      console.error("Error creating event:", error);
      throw error;
    }
    
    return data ? mapFromDbEvent(data) : null;
  } catch (err) {
    console.error("Failed to create event:", err);
    return null;
  }
};

export const updateEvent = async (id: string, event: Omit<CalendarEvent, "id">, userId: string): Promise<CalendarEvent | null> => {
  try {
    const { data, error } = await supabase
      .from("calendar_events")
      .update(mapToDbEvent(event, userId))
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating event:", error);
      throw error;
    }
    
    return data ? mapFromDbEvent(data) : null;
  } catch (err) {
    console.error("Failed to update event:", err);
    return null;
  }
};

export const deleteEvent = async (id: string, userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("calendar_events")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);
      
    if (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
    
    return true;
  } catch (err) {
    console.error("Failed to delete event:", err);
    return false;
  }
};
