
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
    // If we have unit IDs, we'll handle them with mock data since they're not in the database
    if (unitIds && unitIds.length > 0) {
      // Mock filtering for unit IDs since there's no direct database relation
      if (unitIds.includes('unit1')) {
        // Math Department events
        const mockEvents: CalendarEvent[] = [
          {
            id: 'math-event-1',
            title: 'Math Department Meeting',
            start: new Date(new Date().setDate(new Date().getDate() + 1)),
            end: new Date(new Date().setDate(new Date().getDate() + 1) + 2 * 60 * 60 * 1000),
            description: 'Weekly math department meeting',
            color: '#4f46e5',
          },
          {
            id: 'math-event-2',
            title: 'Math Competition Prep',
            start: new Date(new Date().setDate(new Date().getDate() + 3)),
            end: new Date(new Date().setDate(new Date().getDate() + 3) + 3 * 60 * 60 * 1000),
            description: 'Preparation for upcoming math competition',
            color: '#4f46e5',
          }
        ];
        setEvents(mockEvents);
        return;
      } else if (unitIds.includes('unit2')) {
        // Science Department events
        const mockEvents: CalendarEvent[] = [
          {
            id: 'science-event-1',
            title: 'Science Lab Session',
            start: new Date(new Date().setDate(new Date().getDate() + 2)),
            end: new Date(new Date().setDate(new Date().getDate() + 2) + 4 * 60 * 60 * 1000),
            description: 'Hands-on lab session',
            color: '#16a34a',
          }
        ];
        setEvents(mockEvents);
        return;
      } else {
        // For other units, return empty for now
        setEvents([]);
        return;
      }
    }

    // Start query builder
    let query = supabase.from('calendar_events').select('*');
    
    // Apply filters if provided
    if (userIds && userIds.length > 0) {
      query = query.in('user_id', userIds);
    }
    
    // Process role filter
    if (roleFilter && roleFilter.length > 0) {
      // Get user IDs with the specified roles
      const { data: usersWithRole, error: userError } = await supabase
        .from('custom_users')
        .select('id')
        .in('role', roleFilter);
        
      if (userError) {
        console.error("Error fetching users by role:", userError);
        setEvents([]);
        return;
      }
        
      if (usersWithRole && usersWithRole.length > 0) {
        const roleUserIds = usersWithRole.map(user => user.id);
        
        // If we already have specific user IDs, find the intersection
        if (userIds && userIds.length > 0) {
          const filteredIds = roleUserIds.filter(id => userIds.includes(id));
          
          if (filteredIds.length > 0) {
            query = query.in('user_id', filteredIds);
          } else {
            // No matching users, return empty
            setEvents([]);
            return;
          }
        } else {
          // Just filter by the role user IDs
          query = query.in('user_id', roleUserIds);
        }
      } else {
        // No users found with this role
        setEvents([]);
        return;
      }
    }
    
    // Apply course filter
    if (courseIds && courseIds.length > 0) {
      query = query.in('course_id', courseIds);
    }
    
    // Apply skill filter
    if (skillIds && skillIds.length > 0) {
      query = query.in('skill_id', skillIds);
    }

    // Execute query
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching filtered events:', error);
      setEvents([]);
      return;
    }
    
    // Map to calendar events format
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
