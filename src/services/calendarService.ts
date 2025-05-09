
import { supabase } from "@/integrations/supabase/client";
import { CalendarEvent } from "@/components/admin/scheduling/types";
import { canManageEvents } from "@/utils/permissions/modulePermissions";
import { UserManagementUser } from "@/types/student";

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

export const fetchEvents = async (userId: string, role: string | null): Promise<CalendarEvent[]> => {
  try {
    let query = supabase.from("calendar_events").select("*");
    
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
      // Teachers see events they created plus events for courses they teach
      console.log("Teacher user, fetching relevant events");
      
      // First get the teacher's courses
      const { data: teacherCourses } = await supabase
        .from("courses")
        .select("id")
        .contains("instructor_ids", [userId]);
      
      if (teacherCourses && teacherCourses.length > 0) {
        const courseIds = teacherCourses.map(course => course.id);
        
        // Get events that are either created by this user or related to courses they teach
        query = query.or(`user_id.eq.${userId},description.ilike.%course_id:${courseIds.join('%,description.ilike.%course_id:')}%`);
      } else {
        // If teacher has no courses, only show events they created
        query = query.eq("user_id", userId);
      }
    } else if (role === 'student') {
      // Students see events for courses they're enrolled in
      console.log("Student user, fetching enrolled course events");
      
      // First get the student's enrolled courses
      const { data: studentCourses } = await supabase
        .from("courses")
        .select("id")
        .contains("student_ids", [userId]);
      
      if (studentCourses && studentCourses.length > 0) {
        const courseIds = studentCourses.map(course => course.id);
        
        // Get events related to courses they're enrolled in
        query = query.or(`user_id.eq.${userId},description.ilike.%course_id:${courseIds.join('%,description.ilike.%course_id:')}%`);
      } else {
        // If student has no enrolled courses, only show events they created
        query = query.eq("user_id", userId);
      }
    } else {
      // Default case - users only see their own events
      query = query.eq("user_id", userId);
    }
      
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching events:", error);
      return [];
    }
    
    return data ? data.map(mapFromDbEvent) : [];
  } catch (err) {
    console.error("Failed to fetch events:", err);
    return [];
  }
};

export const createEvent = async (event: Omit<CalendarEvent, "id">, userId: string, user?: UserManagementUser): Promise<CalendarEvent | null> => {
  try {
    // Check permissions if user object is provided and is an admin
    if (user && user.role === 'admin' && !canManageEvents(user, 'add')) {
      console.error("User does not have permission to create events");
      throw new Error("You don't have permission to create events");
    }
    
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

export const updateEvent = async (id: string, event: Omit<CalendarEvent, "id">, userId: string, user?: UserManagementUser): Promise<CalendarEvent | null> => {
  try {
    // For admins, check if they have edit permission
    if (user && user.role === 'admin') {
      const hasEditPermission = canManageEvents(user, 'edit');
      
      if (hasEditPermission) {
        // Admin with edit permission can edit any event
        const { data, error } = await supabase
          .from("calendar_events")
          .update(mapToDbEvent(event, userId))
          .eq("id", id)
          .select()
          .single();
          
        if (error) {
          console.error("Error updating event:", error);
          throw error;
        }
        
        return data ? mapFromDbEvent(data) : null;
      } else {
        // Admin without edit permission can only edit their own events
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
      }
    } else {
      // Non-admin users can only edit their own events
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
    }
  } catch (err) {
    console.error("Failed to update event:", err);
    return null;
  }
};

export const deleteEvent = async (id: string, userId: string, user?: UserManagementUser): Promise<boolean> => {
  try {
    // For admins, check if they have delete permission
    if (user && user.role === 'admin') {
      const hasDeletePermission = canManageEvents(user, 'delete');
      
      if (hasDeletePermission) {
        // Admin with delete permission can delete any event
        const { error } = await supabase
          .from("calendar_events")
          .delete()
          .eq("id", id);
          
        if (error) {
          console.error("Error deleting event:", error);
          throw error;
        }
        
        return true;
      } else {
        // Admin without delete permission can only delete their own events
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
      }
    } else {
      // Non-admin users can only delete their own events
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
    }
  } catch (err) {
    console.error("Failed to delete event:", err);
    return false;
  }
};
