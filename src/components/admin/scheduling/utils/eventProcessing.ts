
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
      const coursesToFilter: string[] = [];
      
      // Add courseIds if it exists and has items
      if (Array.isArray(courseIds) && courseIds.length > 0) {
        // Using standard for loop to avoid TypeScript infinite instantiation
        for (let i = 0; i < courseIds.length; i++) {
          const id = courseIds[i];
          if (id) coursesToFilter.push(id);
        }
      }
      
      // Add courseId if it exists
      if (courseId) {
        coursesToFilter.push(courseId);
      }
      
      // Apply filter only if we have courses to filter
      if (coursesToFilter.length > 0) {
        query = query.in('course_id', coursesToFilter);
      }
    }
    
    // Process skill filtering
    if ((skillIds && skillIds.length > 0) || skillId) {
      const skillsToFilter: string[] = [];
      
      // Add skillIds if it exists and has items
      if (Array.isArray(skillIds) && skillIds.length > 0) {
        // Using standard for loop to avoid TypeScript infinite instantiation
        for (let i = 0; i < skillIds.length; i++) {
          const id = skillIds[i];
          if (id) skillsToFilter.push(id);
        }
      }
      
      // Add skillId if it exists
      if (skillId) {
        skillsToFilter.push(skillId);
      }
      
      // Apply filter only if we have skills to filter
      if (skillsToFilter.length > 0) {
        query = query.in('skill_id', skillsToFilter);
      }
    }
    
    // Process user filtering
    if ((userIds && userIds.length > 0) || userId) {
      const usersToFilter: string[] = [];
      
      // Add userIds if it exists and has items
      if (Array.isArray(userIds) && userIds.length > 0) {
        // Using standard for loop to avoid TypeScript infinite instantiation
        for (let i = 0; i < userIds.length; i++) {
          const id = userIds[i];
          if (id) usersToFilter.push(id);
        }
      }
      
      // Add userId if it exists
      if (userId) {
        usersToFilter.push(userId);
      }
      
      // Apply filter only if we have users to filter
      if (usersToFilter.length > 0) {
        query = query.in('user_id', usersToFilter);
      }
    }
    
    // Process role filtering
    if (roleFilter && Array.isArray(roleFilter) && roleFilter.length > 0) {
      const { data: userIds } = await supabase
        .from('custom_users')
        .select('id')
        .in('role', roleFilter);
      
      if (userIds && userIds.length > 0) {
        const filteredUserIds = userIds.map(u => u.id);
        query = query.in('user_id', filteredUserIds);
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
