
// Importing the necessary modules
import { supabase } from '@/integrations/supabase/client';
import { CalendarEvent } from '../context/calendarTypes';

// Define filter parameters interface
interface EventFilterParams {
  courseIds?: string[];
  skillIds?: string[];
  userIds?: string[];
  roleFilter?: string[];
  setEvents: (events: CalendarEvent[]) => void;
}

// Function to fetch events filtered by various parameters
export const fetchFilteredEvents = async ({
  courseIds = [],
  skillIds = [],
  userIds = [],
  roleFilter = [],
  setEvents
}: EventFilterParams) => {
  try {
    console.log('Fetching filtered events with params:', { courseIds, skillIds, userIds, roleFilter });

    // Start with the basic query
    let query = supabase.from('user_events').select(`
      *,
      custom_users!user_id (
        id,
        first_name,
        last_name,
        role
      )
    `);

    // Apply filters if provided
    if (userIds && userIds.length > 0) {
      query = query.in('user_id', userIds);
    }

    // Execute the query
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching events:', error);
      throw error;
    }

    // Filter by role if needed
    let filteredData = data;
    if (roleFilter && roleFilter.length > 0) {
      filteredData = data.filter(event => {
        const userRole = event.custom_users?.role;
        return userRole && roleFilter.includes(userRole);
      });
    }

    // Map to calendar events format
    const events: CalendarEvent[] = filteredData.map(event => ({
      id: event.id,
      title: event.title,
      start: new Date(event.start_time),
      end: new Date(event.end_time),
      description: event.description,
      // Apply color based on role
      color: event.custom_users?.role === 'teacher' ? '#4f46e5' : 
             event.custom_users?.role === 'admin' ? '#0891b2' : 
             event.custom_users?.role === 'student' ? '#16a34a' : 
             event.custom_users?.role === 'superadmin' ? '#9333ea' : '#6b7280',
    }));

    console.log(`Fetched ${events.length} events.`);
    setEvents(events);
    return events;
  } catch (err) {
    console.error('Failed to fetch filtered events:', err);
    // Return empty array to avoid breaking the UI
    setEvents([]);
    return [];
  }
};
