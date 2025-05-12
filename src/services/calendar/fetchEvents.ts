
import { supabase } from "@/integrations/supabase/client";
import { CalendarEvent } from "@/components/admin/scheduling/types";
import { mapFromDbEvent } from "./mappers";
import { canManageEvents } from "@/utils/permissions/modulePermissions";

export const fetchEvents = async (userId: string, role: string | null): Promise<CalendarEvent[]> => {
  try {
    console.log(`Fetching events for user ${userId} with role ${role}`);
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
    
    console.log(`Successfully fetched ${data?.length || 0} events from database`);
    
    const mappedEvents = data ? data.map(mapFromDbEvent) : [];
    console.log(`Mapped ${mappedEvents.length} events`);
    
    return mappedEvents;
  } catch (err) {
    console.error("Failed to fetch events:", err);
    return [];
  }
};
