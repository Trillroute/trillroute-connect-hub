
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
    
    // Process course filtering
    if ((courseIds && courseIds.length > 0) || courseId) {
      const coursesToFilter = [...courseIds];
      if (courseId) coursesToFilter.push(courseId);
      
      // Filter out null/undefined values and apply the filter
      const validCourseIds = coursesToFilter.filter(Boolean);
      if (validCourseIds.length > 0) {
        query = query.in('course_id', validCourseIds);
      }
    }
    
    // Process skill filtering
    if ((skillIds && skillIds.length > 0) || skillId) {
      const skillsToFilter = [...skillIds];
      if (skillId) skillsToFilter.push(skillId);
      
      // Filter out null/undefined values and apply the filter
      const validSkillIds = skillsToFilter.filter(Boolean);
      if (validSkillIds.length > 0) {
        query = query.in('skill_id', validSkillIds);
      }
    }
    
    // Process user filtering
    if ((userIds && userIds.length > 0) || userId) {
      const usersToFilter = [...userIds];
      if (userId) usersToFilter.push(userId);
      
      // Filter out null/undefined values and apply the filter
      const validUserIds = usersToFilter.filter(Boolean);
      if (validUserIds.length > 0) {
        query = query.in('user_id', validUserIds);
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
