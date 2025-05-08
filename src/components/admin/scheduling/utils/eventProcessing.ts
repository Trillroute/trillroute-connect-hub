
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
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
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
    console.log('Fetching filtered events with options:', { courseId, courseIds, skillId, skillIds, userId, userIds, roleFilter });
    
    // Start building the query
    let query = supabase
      .from('user_events')
      .select(`
        *,
        custom_users!user_id (first_name, last_name, role)
      `);
    
    // Process course filtering
    const coursesToFilter: string[] = [];
    
    // Safely add courseIds if they exist
    if (Array.isArray(courseIds) && courseIds.length > 0) {
      courseIds.forEach(id => {
        if (id) coursesToFilter.push(id);
      });
    }
    
    // Add single courseId if it exists
    if (courseId) {
      coursesToFilter.push(courseId);
    }
    
    // Apply course filter if we have any courses
    if (coursesToFilter.length > 0) {
      query = query.in('course_id', coursesToFilter);
    }
    
    // Process skill filtering
    const skillsToFilter: string[] = [];
    
    // Safely add skillIds if they exist
    if (Array.isArray(skillIds) && skillIds.length > 0) {
      skillIds.forEach(id => {
        if (id) skillsToFilter.push(id);
      });
    }
    
    // Add single skillId if it exists
    if (skillId) {
      skillsToFilter.push(skillId);
    }
    
    // Apply skill filter if we have any skills
    if (skillsToFilter.length > 0) {
      query = query.in('skill_id', skillsToFilter);
    }
    
    // Process user filtering
    const usersToFilter: string[] = [];
    
    // Safely add userIds if they exist
    if (Array.isArray(userIds) && userIds.length > 0) {
      userIds.forEach(id => {
        if (id) usersToFilter.push(id);
      });
    }
    
    // Add single userId if it exists
    if (userId) {
      usersToFilter.push(userId);
    }
    
    // Apply user filter if we have any users
    if (usersToFilter.length > 0) {
      query = query.in('user_id', usersToFilter);
    }
    
    // Process role filtering
    if (roleFilter && Array.isArray(roleFilter) && roleFilter.length > 0) {
      try {
        const { data: userIds } = await supabase
          .from('custom_users')
          .select('id')
          .in('role', roleFilter);
        
        if (userIds && userIds.length > 0) {
          const filteredUserIds = userIds.map(u => u.id);
          query = query.in('user_id', filteredUserIds);
        }
      } catch (error) {
        console.error("Error fetching users by role:", error);
      }
    }
    
    // Execute the query
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching filtered events:", error);
      return;
    }
    
    // Map to calendar events format
    const mappedEvents = Array.isArray(data) ? data.map(event => ({
      id: event.id,
      title: event.title || '',
      start: new Date(event.start_time),
      end: new Date(event.end_time),
      description: event.description || '',
      color: getEventColorByRole(event.custom_users?.role)
    })) : [];
    
    console.log(`Successfully mapped ${mappedEvents.length} events`);
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
