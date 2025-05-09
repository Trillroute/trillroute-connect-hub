
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

    // Prepare filter conditions for the query
    const filterConditions: Record<string, any> = {};
    let filteredUserIds: string[] | undefined = userIds;
    
    // Process role filter - completely separated from the main query to avoid deep type instantiation
    if (roleFilter && roleFilter.length > 0) {
      // First fetch users with the specified roles
      const { data: roleUsers, error: roleError } = await supabase
        .from('custom_users')
        .select('id')
        .in('role', roleFilter);
      
      if (roleError) {
        console.error("Error fetching users by role:", roleError);
        setEvents([]);
        return;
      }
      
      if (roleUsers && roleUsers.length > 0) {
        const roleUserIds = roleUsers.map(user => user.id);
        
        // If we also have specific user IDs, find their intersection
        if (filteredUserIds && filteredUserIds.length > 0) {
          filteredUserIds = filteredUserIds.filter(id => roleUserIds.includes(id));
          
          if (filteredUserIds.length === 0) {
            // No overlap between specified users and role users
            setEvents([]);
            return;
          }
        } else {
          // No specific user IDs provided, use all users with the specified roles
          filteredUserIds = roleUserIds;
        }
      } else {
        // No users with the specified roles
        setEvents([]);
        return;
      }
    }
    
    // Build and execute query separately to avoid complex type chains
    // This approach separates the query construction steps to prevent TypeScript from creating deep nested types
    let query = supabase.from('calendar_events').select('*');
    
    // Apply user ID filter if we have any
    if (filteredUserIds && filteredUserIds.length > 0) {
      query = query.in('user_id', filteredUserIds);
    }
    
    // Apply course filter
    if (courseIds && courseIds.length > 0) {
      query = query.in('course_id', courseIds);
    }
    
    // Apply skill filter
    if (skillIds && skillIds.length > 0) {
      query = query.in('skill_id', skillIds);
    }

    // Execute the final query
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
