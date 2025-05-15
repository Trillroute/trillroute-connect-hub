
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
  userIds,
  courseIds,
  skillIds,
  roleFilter,
  setEvents
}: EventFilterParams): Promise<void> => {
  try {
    console.log('Fetching filtered events with params:', { 
      userIds: userIds?.length || 0, 
      courseIds: courseIds?.length || 0, 
      skillIds: skillIds?.length || 0, 
      roleFilter 
    });

    // If no filter criteria are provided, clear the events
    if (!userIds?.length && !courseIds?.length && !skillIds?.length && !roleFilter?.length) {
      console.log('No filter criteria, clearing events');
      setEvents([]);
      return;
    }
    
    // Base query to get events
    let query = supabase
      .from('user_events')
      .select(`
        *,
        custom_users:user_id (
          id,
          first_name,
          last_name,
          role,
          skills
        )
      `);
      
    // Apply filters if provided
    if (userIds && userIds.length > 0) {
      query = query.in('user_id', userIds);
      console.log('Filtering events by user IDs:', userIds);
    }
    
    // Fetch the data
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
    
    if (!data || !Array.isArray(data)) {
      console.log('No events data returned or invalid format');
      setEvents([]);
      return;
    }
    
    console.log(`Fetched ${data.length} events before filtering`);
    
    // Apply additional filters that can't be done directly in the query
    let filteredData = data;
    
    // Filter by role if specified
    if (roleFilter && roleFilter.length > 0) {
      filteredData = filteredData.filter(event => {
        const userRole = event.custom_users?.role;
        return userRole && roleFilter.includes(userRole);
      });
      console.log(`After role filtering: ${filteredData.length} events`);
    }
    
    // Map to calendar events format with appropriate color coding
    const mappedEvents: CalendarEvent[] = filteredData.map(event => {
      // Determine color based on user role
      let color;
      switch (event.custom_users?.role) {
        case 'teacher':
          color = '#4f46e5'; // indigo-600
          break;
        case 'admin':
          color = '#0891b2'; // cyan-600
          break;
        case 'student':
          color = '#16a34a'; // green-600
          break;
        case 'superadmin':
          color = '#9333ea'; // purple-600
          break;
        default:
          color = '#6b7280'; // gray-500
      }
      
      return {
        id: event.id,
        title: event.title,
        start: new Date(event.start_time),
        end: new Date(event.end_time),
        description: event.description || '',
        userId: event.user_id,
        color
      };
    });
    
    console.log(`Setting ${mappedEvents.length} filtered events`);
    setEvents(mappedEvents);
    
  } catch (err) {
    console.error('Failed to fetch events:', err);
    setEvents([]);
  }
};
