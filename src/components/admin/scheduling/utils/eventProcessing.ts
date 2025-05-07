
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
    // Start with base query
    let query = supabase
      .from('user_events')
      .select(`
        *,
        custom_users!user_id (first_name, last_name, role)
      `);
    
    // Process course filtering - simplified approach
    if (courseId || (courseIds && courseIds.length > 0)) {
      // Create a safe list of course IDs to filter by
      const filterCourses: string[] = [];
      
      // Only add valid IDs to avoid null/undefined issues
      if (courseId) filterCourses.push(courseId);
      if (courseIds) courseIds.forEach(id => id && filterCourses.push(id));
      
      // Only apply filter if we have valid IDs
      if (filterCourses.length > 0) {
        query = query.in('course_id', filterCourses);
      }
    }
    
    // Process skill filtering - simplified approach
    if (skillId || (skillIds && skillIds.length > 0)) {
      // Create a safe list of skill IDs to filter by
      const filterSkills: string[] = [];
      
      // Only add valid IDs to avoid null/undefined issues
      if (skillId) filterSkills.push(skillId);
      if (skillIds) skillIds.forEach(id => id && filterSkills.push(id));
      
      // Only apply filter if we have valid IDs
      if (filterSkills.length > 0) {
        query = query.in('skill_id', filterSkills);
      }
    }
    
    // Process user filtering - simplified approach
    if (userId || (userIds && userIds.length > 0)) {
      // Create a safe list of user IDs to filter by
      const filterUsers: string[] = [];
      
      // Only add valid IDs to avoid null/undefined issues
      if (userId) filterUsers.push(userId);
      if (userIds) userIds.forEach(id => id && filterUsers.push(id));
      
      // Only apply filter if we have valid IDs
      if (filterUsers.length > 0) {
        query = query.in('user_id', filterUsers);
      }
    }
    
    // Process role filtering
    if (roleFilter && roleFilter.length > 0) {
      const { data: userIds } = await supabase
        .from('custom_users')
        .select('id')
        .in('role', roleFilter);
      
      if (userIds && userIds.length > 0) {
        query = query.in('user_id', userIds.map(u => u.id));
      }
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching filtered events:", error);
      return;
    }
    
    // Map to calendar events format
    const mappedEvents = data.map(event => ({
      id: event.id,
      title: event.title,
      start: new Date(event.start_time),
      end: new Date(event.end_time),
      description: event.description || '',
      color: getEventColorByRole(event.custom_users?.role)
    }));
    
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
