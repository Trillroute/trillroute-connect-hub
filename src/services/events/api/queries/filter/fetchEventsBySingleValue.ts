
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetch events by a single filter value
 */
export const fetchEventsBySingleValue = async (columnName: string, value: string) => {
  try {
    console.log(`Fetching events by ${columnName} = ${value}`);
    
    let query = supabase.from('user_events').select('*');
    
    // Handle different filter types
    if (columnName === 'user_id') {
      query = query.eq('user_id', value);
    } else if (columnName === 'course_id' || columnName === 'skill_id' || columnName === 'teacher_id' || columnName === 'student_id') {
      // For metadata-based filtering, use the metadata column
      query = query.eq(`metadata->${columnName}`, value);
    }
    
    const { data, error } = await query.order('start_time', { ascending: true });

    if (error) {
      console.error(`Error fetching events by ${columnName}:`, error);
      return [];
    }

    console.log(`Found ${data?.length || 0} events for ${columnName} = ${value}`);
    
    // Format the data manually to avoid circular imports
    return (data || []).map((event: any) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      eventType: event.event_type,
      start: new Date(event.start_time),
      end: new Date(event.end_time),
      isBlocked: event.is_blocked || false,
      metadata: event.metadata,
      userId: event.user_id,
      user_id: event.user_id,
      start_time: event.start_time,
      end_time: event.end_time,
      location: (event.metadata && typeof event.metadata === 'object' && 'location' in event.metadata) 
        ? String(event.metadata.location) 
        : undefined,
      color: (event.metadata && typeof event.metadata === 'object' && 'color' in event.metadata) 
        ? String(event.metadata.color) 
        : undefined,
      created_at: event.created_at,
      updated_at: event.updated_at
    }));
  } catch (error) {
    console.error(`Exception in fetchEventsBySingleValue for ${columnName}:`, error);
    return [];
  }
};
