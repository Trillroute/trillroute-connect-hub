
import { supabase } from '@/integrations/supabase/client';
import { CalendarEvent } from '../context/calendarTypes';

// Define simpler types to avoid deep instantiation
type FilterOptions = {
  courseId?: string | null;
  courseIds?: string[];
  skillId?: string | null;
  skillIds?: string[];
  userId?: string | null;
  userIds?: string[];
  roleFilter?: string[];
  setEvents: (events: CalendarEvent[]) => void;
};

export const fetchFilteredEvents = async ({
  courseId,
  courseIds = [],
  skillId,
  skillIds = [],
  userId,
  userIds = [],
  roleFilter,
  setEvents
}: FilterOptions): Promise<void> => {
  try {
    console.log('Filtering events with options:', {
      courseId, courseIds, skillId, skillIds, userId, userIds, roleFilter
    });
    
    // Start with a basic query
    let query = supabase
      .from('user_events')
      .select(`
        *,
        custom_users!user_id (first_name, last_name, role)
      `);
    
    // Process course filtering - use simpler approach to avoid type instantiation issues
    if (courseId && typeof courseId === 'string') {
      console.log('Filtering by course ID:', courseId);
      query = query.eq('course_id', courseId);
    } else if (Array.isArray(courseIds) && courseIds.length > 0) {
      const validCourseIds = courseIds.filter(id => id !== null && id !== undefined);
      if (validCourseIds.length > 0) {
        console.log('Filtering by course IDs:', validCourseIds);
        query = query.in('course_id', validCourseIds);
      }
    }
    
    // Process skill filtering
    if (skillId && typeof skillId === 'string') {
      console.log('Filtering by skill ID:', skillId);
      query = query.eq('skill_id', skillId);
    } else if (Array.isArray(skillIds) && skillIds.length > 0) {
      const validSkillIds = skillIds.filter(id => id !== null && id !== undefined);
      if (validSkillIds.length > 0) {
        console.log('Filtering by skill IDs:', validSkillIds);
        query = query.in('skill_id', validSkillIds);
      }
    }
    
    // Process user filtering
    if (userId && typeof userId === 'string') {
      console.log('Filtering by user ID:', userId);
      query = query.eq('user_id', userId);
    } else if (Array.isArray(userIds) && userIds.length > 0) {
      const validUserIds = userIds.filter(id => id !== null && id !== undefined);
      if (validUserIds.length > 0) {
        console.log('Filtering by user IDs:', validUserIds);
        query = query.in('user_id', validUserIds);
      }
    }
    
    // Process role filtering - separate query to avoid type issues
    if (Array.isArray(roleFilter) && roleFilter.length > 0) {
      try {
        console.log('Fetching users with roles:', roleFilter);
        const { data: filteredUserIds } = await supabase
          .from('custom_users')
          .select('id')
          .in('role', roleFilter);
        
        if (filteredUserIds && filteredUserIds.length > 0) {
          const userIdsArray = filteredUserIds.map(u => u.id);
          console.log('Found users with specified roles:', userIdsArray.length);
          query = query.in('user_id', userIdsArray);
        } else {
          console.log('No users found with the specified roles');
        }
      } catch (err) {
        console.error("Failed to fetch users by role:", err);
      }
    }
    
    // Execute the query
    const { data, error } = await query;
    console.log('Query executed, results:', data?.length || 0);
    
    if (error) {
      console.error("Error fetching filtered events:", error);
      return;
    }
    
    // Map to calendar events format
    const mappedEvents = Array.isArray(data) ? data.map(event => ({
      id: event.id || '',
      title: event.title || 'Untitled Event',
      start: new Date(event.start_time),
      end: new Date(event.end_time),
      description: event.description || '',
      color: event.custom_users?.role ? getEventColorByRole(event.custom_users.role) : '#6b7280'
    })) : [];
    
    console.log('Events mapped:', mappedEvents.length);
    setEvents(mappedEvents);
  } catch (err) {
    console.error("Failed to fetch filtered events:", err);
  }
};

// Helper function to get color based on role
const getEventColorByRole = (role?: string): string => {
  switch (role) {
    case 'teacher':
      return '#4f46e5';
    case 'admin':
      return '#0891b2';
    case 'student':
      return '#16a34a';
    case 'superadmin':
      return '#9333ea';
    default:
      return '#6b7280';
  }
};
