
import { supabase } from "@/integrations/supabase/client";
import { CalendarEvent } from "@/components/admin/scheduling/types";
import { mapFromDbEvent } from "./mappers";
import { canManageEvents } from "@/utils/permissions/modulePermissions";

// Enhanced cache with timestamp tracking for each key
interface CacheEntry {
  events: CalendarEvent[];
  timestamp: number;
}

// Simple in-memory cache for events
const eventCache = new Map<string, CacheEntry>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const fetchEvents = async (userId: string, role: string | null): Promise<CalendarEvent[]> => {
  try {
    // Create cache key based on user and role
    const cacheKey = `${userId}:${role || 'no-role'}`;
    
    // Check if we have a valid cached result
    const cachedData = eventCache.get(cacheKey);
    if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_DURATION) {
      console.log(`Using cached events for user ${userId} (${role})`);
      return cachedData.events;
    }
    
    console.log(`Fetching events for user ${userId} with role ${role}`);
    
    // If not in cache or expired, fetch from database
    let query = supabase.from("calendar_events").select("*");
    
    // Filter events based on user role
    if (role === 'superadmin') {
      // Superadmins see all events
    } else if (role === 'admin') {
      // Check admin permissions
      const user = { id: userId, role: 'admin' };
      const hasViewPermission = canManageEvents(user, 'view');
      
      if (!hasViewPermission) {
        query = query.eq("user_id", userId);
      }
    } else if (role === 'teacher') {
      // Teachers see events they created plus events for courses they teach
      
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
    
    // Map the data to the expected format
    const mappedEvents = data ? data.map(mapFromDbEvent) : [];
    console.log(`Received ${mappedEvents.length} events from API`);
    
    // Store in cache
    eventCache.set(cacheKey, {
      events: mappedEvents,
      timestamp: Date.now()
    });
    
    return mappedEvents;
  } catch (err) {
    console.error("Failed to fetch events:", err);
    return [];
  }
};

// Clear cache manually when data is likely to have changed
export const clearEventCache = (): void => {
  console.log("Clearing event cache");
  eventCache.clear();
};

// Add a method to clear cache for a specific user
export const clearUserEventCache = (userId: string): void => {
  // Remove all cache entries for this user (with any role)
  for (const key of eventCache.keys()) {
    if (key.startsWith(`${userId}:`)) {
      console.log(`Clearing event cache for ${key}`);
      eventCache.delete(key);
    }
  }
};
