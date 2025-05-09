import { supabase } from '@/integrations/supabase/client';
import { CalendarEvent } from '../context/calendarTypes';

interface FetchFilteredEventsOptions {
  userIds?: string[];
  courseIds?: string[];
  skillIds?: string[];
  unitIds?: string[];
  roleFilter?: string[];
  setEvents: (events: CalendarEvent[]) => void;
}

export const fetchFilteredEvents = async ({
  userIds,
  courseIds,
  skillIds,
  unitIds,
  roleFilter,
  setEvents
}: FetchFilteredEventsOptions) => {
  try {
    // Start query builder
    let query = supabase.from('calendar_events').select('*');
    
    // Apply filters if provided
    if (userIds && userIds.length > 0) {
      query = query.in('user_id', userIds);
    }
    
    // If we have course IDs, filter events related to these courses
    if (courseIds && courseIds.length > 0) {
      // This depends on how course relationships are stored
      // Example assumes there's a course_id field or relation
      query = query.in('course_id', courseIds);
    }
    
    // If we have skill IDs, filter events related to these skills  
    if (skillIds && skillIds.length > 0) {
      // This depends on how skill relationships are stored
      // Example assumes there's a skill_id field or relation
      query = query.in('skill_id', skillIds);
    }
    
    // If we have unit IDs, filter events related to these units
    if (unitIds && unitIds.length > 0) {
      // This depends on how unit relationships are stored
      // Example assumes there's a unit_id field or relation
      query = query.in('unit_id', unitIds);
    }

    // If we have role filters, we'd need to join with users table
    // This implementation would depend on your database structure
    if (roleFilter && roleFilter.length > 0) {
      // For simplicity in this example, we'd fetch users with these roles first
      // and then filter events by those user IDs
      const { data: usersWithRole } = await supabase
        .from('custom_users')
        .select('id')
        .in('role', roleFilter);
        
      if (usersWithRole && usersWithRole.length > 0) {
        const roleUserIds = usersWithRole.map(user => user.id);
        query = query.in('user_id', roleUserIds);
      } else {
        // If no users match the role filter, return empty array
        setEvents([]);
        return;
      }
    }

    // Execute query
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching filtered events:', error);
      setEvents([]);
      return;
    }
    
    // Map to calendar events
    const mappedEvents: CalendarEvent[] = data.map(event => ({
      id: event.id,
      title: event.title,
      start: new Date(event.start_time),
      end: new Date(event.end_time),
      description: event.description || '',
      location: event.location || '',
      color: event.color || '#3b82f6',
    }));
    
    setEvents(mappedEvents);
  } catch (error) {
    console.error('Failed to fetch filtered events:', error);
    setEvents([]);
  }
};
