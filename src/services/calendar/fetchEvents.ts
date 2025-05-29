
import { supabase } from "@/integrations/supabase/client";
import { CalendarEvent } from "@/components/admin/scheduling/types";
import { mapFromDbEvent } from "./mappers";
import { canManageEvents } from "@/utils/permissions/modulePermissions";

export const fetchEvents = async (userId: string, role: string | null): Promise<CalendarEvent[]> => {
  try {
    console.log('fetchEvents called with:', { userId, role });
    
    // Fetch from user_events table instead of calendar_events
    let query = supabase.from("user_events").select("*");
    
    // Filter events based on user role
    if (role === 'superadmin') {
      // Superadmins see all events
      console.log("Superadmin user, fetching all events");
    } else if (role === 'admin') {
      // Check admin permissions
      const user = { id: userId, role: 'admin' };
      const hasViewPermission = canManageEvents(user, 'view');
      
      if (hasViewPermission) {
        console.log("Admin with event view permissions, fetching all events");
      } else {
        console.log("Admin without event view permissions, fetching only own events");
        query = query.eq("user_id", userId);
      }
    } else if (role === 'teacher') {
      // Teachers see events they created plus events where they are mentioned in metadata
      console.log("Teacher user, fetching relevant events");
      
      // Get events that are either created by this user or where they are the teacher
      query = query.or(`user_id.eq.${userId},metadata->>teacherId.eq.${userId}`);
    } else if (role === 'student') {
      // Students see events where they are mentioned in metadata
      console.log("Student user, fetching enrolled course events");
      
      // Get events where they are the student in metadata OR where user_id matches (for their own events)
      query = query.or(`user_id.eq.${userId},metadata->>studentId.eq.${userId}`);
    } else {
      // Default case - users only see their own events
      console.log("Default case - fetching only own events");
      query = query.eq("user_id", userId);
    }
      
    const { data, error } = await query.order('start_time', { ascending: true });
    
    if (error) {
      console.error("Error fetching events:", error);
      return [];
    }
    
    console.log(`Raw data from user_events table:`, data);
    console.log(`Fetched ${data?.length || 0} events from user_events table`);
    
    if (data && data.length > 0) {
      console.log('Sample event data:', data[0]);
      data.forEach((event, index) => {
        console.log(`Event ${index + 1}:`, {
          id: event.id,
          title: event.title,
          start_time: event.start_time,
          end_time: event.end_time,
          event_type: event.event_type,
          user_id: event.user_id,
          metadata: event.metadata
        });
      });
    }
    
    // Convert user_events format to CalendarEvent format with proper date parsing
    const events = data ? data.map((event) => {
      // Parse dates properly - ensure they are valid Date objects
      const startDate = new Date(event.start_time);
      const endDate = new Date(event.end_time);
      
      // Check if dates are valid
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        console.error('Invalid date format for event:', event.id, {
          start_time: event.start_time,
          end_time: event.end_time
        });
        return null;
      }
      
      const mappedEvent = {
        id: event.id,
        title: event.title,
        description: event.description || '',
        start: startDate,
        end: endDate,
        userId: event.user_id,
        eventType: event.event_type || 'general',
        isBlocked: event.is_blocked || false,
        metadata: event.metadata || {},
        user_id: event.user_id,
        start_time: event.start_time,
        end_time: event.end_time,
        location: (event.metadata && typeof event.metadata === 'object' && 'location' in event.metadata) 
          ? String(event.metadata.location) 
          : undefined,
        color: (event.metadata && typeof event.metadata === 'object' && 'color' in event.metadata) 
          ? String(event.metadata.color) 
          : '#4285F4', // Default color for class events
        created_at: event.created_at,
        updated_at: event.updated_at
      };
      
      console.log('Mapped event with valid dates:', {
        id: mappedEvent.id,
        title: mappedEvent.title,
        start: mappedEvent.start,
        end: mappedEvent.end,
        startValid: !isNaN(mappedEvent.start.getTime()),
        endValid: !isNaN(mappedEvent.end.getTime()),
        metadata: mappedEvent.metadata
      });
      
      return mappedEvent;
    }).filter(event => event !== null) : [];
    
    console.log(`Returning ${events.length} valid mapped events`);
    return events;
  } catch (err) {
    console.error("Failed to fetch events:", err);
    return [];
  }
};
