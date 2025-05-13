
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
  // Use a single console log for debug information instead of multiple
  if (process.env.NODE_ENV === 'development') {
    console.log('Fetching filtered events with params:', {
      courseIds,
      skillIds,
      userIds,
      roleFilter
    });
  }
  
  try {
    // Get current user
    const { data: currentUser } = await supabase.auth.getUser();
    if (!currentUser?.user) {
      console.error('No authenticated user found');
      return [];
    }
    
    // If we have a specific user filter, fetch events for those users
    if (userIds && userIds.length > 0) {
      // If user has role specified, use that for fetching events
      const userRole = roleFilter && roleFilter.length > 0 ? roleFilter[0] : null;
      
      // Batch fetch events to reduce number of API calls
      const batchSize = 5;
      let allEvents: CalendarEvent[] = [];
      
      for (let i = 0; i < userIds.length; i += batchSize) {
        const batch = userIds.slice(i, i + batchSize);
        const batchPromises = batch.map(userId => fetchEvents(userId, userRole));
        const batchResults = await Promise.all(batchPromises);
        allEvents = [...allEvents, ...batchResults.flat()];
      }
      
      if (setEvents) {
        setEvents(allEvents);
      }
      
      return allEvents;
    }
    
    // If we have course or skill filter but no specific users
    if ((courseIds && courseIds.length > 0) || (skillIds && skillIds.length > 0)) {
      // Use current user for fetching with enhanced metadata filter  
      const events = await fetchEvents(
        currentUser.user.id,
        currentUser.user.app_metadata.role
      );
      
      // Filter events by course or skill more efficiently
      const filteredEvents = events.filter(event => {
        // Extract IDs only once per event
        const extractedIds = getEventIdentifiers(event);
        
        // Match based on course or skill
        const matchesCourse = courseIds && courseIds.length > 0 ? 
          courseIds.includes(extractedIds.courseId) : false;
          
        const matchesSkill = skillIds && skillIds.length > 0 ? 
          skillIds.includes(extractedIds.skillId) : false;
        
        return matchesCourse || matchesSkill;
      });
      
      if (setEvents) {
        setEvents(filteredEvents);
      }
      
      return filteredEvents;
    }
    
    // Default case: fetch events based on role filter  
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

/**
 * Extract course and skill IDs from an event
 * Caches the extracted values for better performance
 */
const getEventIdentifiers = (event: CalendarEvent) => {
  // Extract course and skill info from event metadata, direct property, or description
  const courseId = event.courseId || 
    (event.metadata?.courseId) || 
    (event.description?.includes('course_id:') ? 
      event.description.match(/course_id:([^,\s]+)/)?.[1] : null);
          
  const skillId = event.skillId || 
    (event.metadata?.skillId) || 
    (event.description?.includes('skill_id:') ? 
      event.description.match(/skill_id:([^,\s]+)/)?.[1] : null);
  
  return { courseId, skillId };
};
