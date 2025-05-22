
import { supabase } from '@/integrations/supabase/client';
import { CalendarEvent, UserEventFromDB } from '../../types/eventTypes';
import { formatEventData } from '../utils/eventFormatters';

/**
 * Fetch available time slots where all specified users are available
 * 
 * @param userIds Array of user IDs to check availability for
 * @returns Array of overlapping available time slots
 */
export async function fetchOverlappingAvailability(
  userIds: string[]
): Promise<CalendarEvent[]> {
  try {
    console.log(`Fetching overlapping availability for users:`, userIds);
    
    if (!userIds.length) {
      return [];
    }
    
    // Get all availability events for these users
    const { data, error } = await supabase
      .from('user_events')
      .select('*')
      .in('user_id', userIds)
      .eq('event_type', 'availability');
    
    // Handle query error
    if (error) {
      console.error('Error fetching overlapping availability:', error);
      return [];
    }
    
    // If no data or empty results, return empty array
    if (!data || data.length === 0) {
      return [];
    }
    
    // Group events by time slot (day and hour)
    const eventsByTimeSlot: Record<string, UserEventFromDB[]> = {};
    
    (data as UserEventFromDB[]).forEach(event => {
      // Create a key for the time slot (e.g., "Monday-9:00-10:00")
      const startDate = new Date(event.start_time);
      const endDate = new Date(event.end_time);
      const day = startDate.getDay();
      const startHour = startDate.getHours();
      const endHour = endDate.getHours();
      
      const key = `${day}-${startHour}-${endHour}`;
      
      if (!eventsByTimeSlot[key]) {
        eventsByTimeSlot[key] = [];
      }
      
      eventsByTimeSlot[key].push(event);
    });
    
    // Filter for slots where all users have availability
    const overlappingSlots: UserEventFromDB[] = [];
    
    Object.entries(eventsByTimeSlot).forEach(([key, events]) => {
      // Get unique user IDs for this time slot
      const slotUserIds = [...new Set(events.map(event => event.user_id))];
      
      // If all users have an event for this slot, include one of the events
      if (slotUserIds.length === userIds.length && 
          userIds.every(id => slotUserIds.includes(id))) {
        overlappingSlots.push(events[0]);
      }
    });
    
    return formatEventData(overlappingSlots);
  } catch (error) {
    console.error('Exception in fetchOverlappingAvailability:', error);
    return [];
  }
}
