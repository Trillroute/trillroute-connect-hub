
import { supabase } from '@/integrations/supabase/client';

// Get color based on role
export const getRoleColor = (role?: string): string => {
  switch (role) {
    case 'teacher':
      return '#4f46e5'; // Indigo
    case 'admin':
      return '#0891b2'; // Cyan
    case 'student': 
      return '#16a34a'; // Green
    case 'superadmin':
      return '#9333ea'; // Purple
    default:
      return '#6b7280'; // Gray
  }
};

// Format event data from Supabase to CalendarEvent format
export const mapEventData = (event: any) => {
  // Extract location from metadata if it's an object with a location property
  let locationValue = '';
  if (event.metadata && typeof event.metadata === 'object' && !Array.isArray(event.metadata)) {
    locationValue = (event.metadata as Record<string, any>).location || '';
  }
  
  return {
    id: event.id,
    title: event.title,
    start: new Date(event.start_time),
    end: new Date(event.end_time),
    description: event.description,
    color: getRoleColor(event.custom_users?.role),
    location: locationValue
  };
};

// Fetch events with filters
export const fetchFilteredEvents = async ({
  userId,
  userIds,
  courseId,
  skillId,
  roleFilter,
  setEvents,
}: {
  userId?: string;
  userIds?: string[];
  courseId?: string;
  skillId?: string;
  roleFilter?: string[];
  setEvents: (events: any[]) => void;
}) => {
  try {
    // Start building the query
    let query = supabase.from('user_events').select(`
      *,
      custom_users!user_id (id, first_name, last_name, role)
    `);
    
    // Filter by specific user ID
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    // Filter by multiple user IDs
    if (userIds && userIds.length > 0) {
      query = query.in('user_id', userIds);
    }
    
    // Filter by course ID
    if (courseId) {
      query = query.ilike('description', `%course_id:${courseId}%`);
    }
    
    // Filter by skill ID
    if (skillId) {
      // Get users with this skill (using the new skills array column)
      const { data: skillUsers } = await supabase
        .from('custom_users')
        .select('id')
        .contains('skills', [skillId]);
        
      if (skillUsers && skillUsers.length > 0) {
        const skillUserIds = skillUsers.map(item => item.id);
        query = query.in('user_id', skillUserIds);
      } else {
        // No users have this skill, return empty events
        setEvents([]);
        return;
      }
    }
    
    // Fetch events
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching filtered events:", error);
      setEvents([]);
      return;
    }
    
    // Further filter by role if needed
    let filteredData = data;
    if (roleFilter && roleFilter.length > 0) {
      filteredData = data.filter(event => {
        const userRole = event.custom_users?.role;
        return userRole && roleFilter.includes(userRole);
      });
    }
    
    // Map to calendar events format
    const mappedEvents = filteredData.map(mapEventData);
    
    // Update events in context
    setEvents(mappedEvents);
  } catch (err) {
    console.error("Failed to fetch filtered events:", err);
    setEvents([]);
  }
};
