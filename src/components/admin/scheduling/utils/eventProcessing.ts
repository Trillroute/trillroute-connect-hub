
import { fetchEvents } from '@/services/calendar/fetchEvents';
import { CalendarEvent } from '../context/calendarTypes';
import { supabase } from "@/integrations/supabase/client";

interface FetchFilteredEventsProps {
  userIds?: string[];
  courseIds?: string[];
  skillIds?: string[];
  roleFilter?: string[];
  setEvents?: (events: CalendarEvent[]) => void;
}

/**
 * Fetch events filtered by different criteria
 */
export const fetchFilteredEvents = async ({
  userIds,
  courseIds,
  skillIds,
  roleFilter,
  setEvents
}: FetchFilteredEventsProps): Promise<CalendarEvent[]> => {
  console.log('Fetching filtered events with params:', {
    courseIds,
    skillIds,
    userIds,
    roleFilter
  });
  
  try {
    // Get current user
    const { data: currentUser } = await supabase.auth.getUser();
    if (!currentUser?.user) {
      console.error('No authenticated user found');
      return [];
    }
    
    // If we have a specific user filter, fetch events for those users
    if (userIds && userIds.length > 0) {
      console.log(`Fetching events for ${userIds.length} specific users`);
      
      // If user has role specified, use that for fetching events
      const userRole = roleFilter && roleFilter.length > 0 ? roleFilter[0] : null;
      
      let allEvents: CalendarEvent[] = [];
      for (const userId of userIds) {
        const events = await fetchEvents(userId, userRole);
        allEvents = [...allEvents, ...events];
      }
      
      if (setEvents) {
        setEvents(allEvents);
      }
      
      return allEvents;
    }
    
    // If we have course or skill filter but no specific users
    if ((courseIds && courseIds.length > 0) || (skillIds && skillIds.length > 0)) {
      console.log(`Fetching events for ${courseIds?.length || 0} courses and ${skillIds?.length || 0} skills`);
      
      // Use current user for fetching with enhanced metadata filter  
      const events = await fetchEvents(
        currentUser.user.id,
        currentUser.user.app_metadata.role
      );
      
      // Filter events by course or skill
      const filteredEvents = events.filter(event => {
        // Extract course and skill info from event metadata or description
        const eventCourseId = event.courseId || 
          (event.metadata?.courseId) || 
          (event.description?.includes('course_id:') ? 
            event.description.match(/course_id:([^,\s]+)/)?.[1] : null);
            
        const eventSkillId = event.metadata?.skillId || 
          (event.description?.includes('skill_id:') ? 
            event.description.match(/skill_id:([^,\s]+)/)?.[1] : null);
        
        // Match based on course or skill
        const matchesCourse = courseIds && courseIds.length > 0 ? 
          courseIds.includes(eventCourseId) : false;
          
        const matchesSkill = skillIds && skillIds.length > 0 ? 
          skillIds.includes(eventSkillId) : false;
        
        return matchesCourse || matchesSkill;
      });
      
      if (setEvents) {
        setEvents(filteredEvents);
      }
      
      return filteredEvents;
    }
    
    // Default case: fetch events based on role filter  
    console.log(`Fetching events for role filter: ${roleFilter?.join(', ')}`);
    
    // If no specific filters but we have a role filter
    if (roleFilter && roleFilter.length > 0) {
      const events = await fetchEvents(
        currentUser.user.id,
        roleFilter[0]
      );
      
      if (setEvents) {
        setEvents(events);
      }
      
      return events;
    }
    
    // Fallback to fetching events with current user's role
    const events = await fetchEvents(
      currentUser.user.id,
      currentUser.user.app_metadata.role
    );
    
    if (setEvents) {
      setEvents(events);
    }
    
    return events;
    
  } catch (error) {
    console.error('Error fetching filtered events:', error);
    return [];
  }
};
