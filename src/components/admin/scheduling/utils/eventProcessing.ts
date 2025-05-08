
import { supabase } from '@/integrations/supabase/client';
import { CalendarEvent } from '../context/calendarTypes';

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
    let query = supabase
      .from('user_events')
      .select(`
        *,
        custom_users!user_id (first_name, last_name, role)
      `);
    
    // Process course filtering - simplified approach to avoid deep type instantiation
    if (courseId && typeof courseId === 'string') {
      query = query.eq('course_id', courseId);
    } else if (Array.isArray(courseIds) && courseIds.length > 0) {
      // Filter out null and undefined values
      const validCourseIds = courseIds.filter(id => id !== null && id !== undefined);
      if (validCourseIds.length > 0) {
        query = query.in('course_id', validCourseIds);
      }
    }
    
    // Process skill filtering - simplified approach to avoid deep type instantiation
    if (skillId && typeof skillId === 'string') {
      query = query.eq('skill_id', skillId);
    } else if (Array.isArray(skillIds) && skillIds.length > 0) {
      // Filter out null and undefined values
      const validSkillIds = skillIds.filter(id => id !== null && id !== undefined);
      if (validSkillIds.length > 0) {
        query = query.in('skill_id', validSkillIds);
      }
    }
    
    // Process user filtering - simplified approach to avoid deep type instantiation
    if (userId && typeof userId === 'string') {
      query = query.eq('user_id', userId);
    } else if (Array.isArray(userIds) && userIds.length > 0) {
      // Filter out null and undefined values
      const validUserIds = userIds.filter(id => id !== null && id !== undefined);
      if (validUserIds.length > 0) {
        query = query.in('user_id', validUserIds);
      }
    }
    
    // Process role filtering
    if (Array.isArray(roleFilter) && roleFilter.length > 0) {
      try {
        const { data: filteredUserIds } = await supabase
          .from('custom_users')
          .select('id')
          .in('role', roleFilter);
        
        if (filteredUserIds && filteredUserIds.length > 0) {
          const userIdsArray = filteredUserIds.map(u => u.id);
          query = query.in('user_id', userIdsArray);
        }
      } catch (err) {
        console.error("Failed to fetch users by role:", err);
      }
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching filtered events:", error);
      return;
    }
    
    // Map to calendar events format with proper null checking
    const mappedEvents = Array.isArray(data) ? data.map(event => ({
      id: event.id,
      title: event.title || 'Untitled Event',
      start: new Date(event.start_time),
      end: new Date(event.end_time),
      description: event.description || '',
      color: event.custom_users?.role ? getEventColorByRole(event.custom_users.role) : '#6b7280'
    })) : [];
    
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
