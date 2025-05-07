
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
    
    // Process course filtering with explicit types - avoiding array methods
    const filterCourses: string[] = [];
    
    // Add single courseId if it exists
    if (courseId) {
      filterCourses.push(courseId);
    }
    
    // Add multiple courseIds if they exist
    if (courseIds && Array.isArray(courseIds)) {
      for (let i = 0; i < courseIds.length; i++) {
        if (courseIds[i]) {
          filterCourses.push(courseIds[i]);
        }
      }
    }
    
    if (filterCourses.length > 0) {
      query = query.in('course_id', filterCourses);
    }
    
    // Process skill filtering with explicit types - avoiding array methods
    const filterSkills: string[] = [];
    
    // Add single skillId if it exists
    if (skillId) {
      filterSkills.push(skillId);
    }
    
    // Add multiple skillIds if they exist
    if (skillIds && Array.isArray(skillIds)) {
      for (let i = 0; i < skillIds.length; i++) {
        if (skillIds[i]) {
          filterSkills.push(skillIds[i]);
        }
      }
    }
    
    if (filterSkills.length > 0) {
      query = query.in('skill_id', filterSkills);
    }
    
    // Process user filtering with explicit types - avoiding array methods
    const filterUsers: string[] = [];
    
    // Add single userId if it exists
    if (userId) {
      filterUsers.push(userId);
    }
    
    // Add multiple userIds if they exist
    if (userIds && Array.isArray(userIds)) {
      for (let i = 0; i < userIds.length; i++) {
        if (userIds[i]) {
          filterUsers.push(userIds[i]);
        }
      }
    }
    
    if (filterUsers.length > 0) {
      query = query.in('user_id', filterUsers);
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
