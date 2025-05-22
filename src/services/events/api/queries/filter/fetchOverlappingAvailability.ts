
import { supabase } from '@/integrations/supabase/client';
import { UserAvailability, DbUserAvailability } from '@/services/availability/types';

/**
 * Transforms a database user availability to the application format
 */
const transformDbToUserAvailability = (dbItem: DbUserAvailability): UserAvailability => ({
  id: dbItem.id,
  user_id: dbItem.user_id,
  userId: dbItem.user_id, // Alias for better compatibility
  dayOfWeek: dbItem.day_of_week,
  startTime: dbItem.start_time,
  endTime: dbItem.end_time,
  category: dbItem.category,
  created_at: dbItem.created_at,
  updated_at: dbItem.updated_at
});

/**
 * Fetches availability slots that overlap with the given time range
 * @param dayOfWeek The day of the week (0-6, where 0 is Sunday)
 * @param startTime Start time in HH:MM format
 * @param endTime End time in HH:MM format
 * @returns Promise with overlapping availability slots
 */
export const fetchOverlappingAvailability = async (
  dayOfWeek: number,
  startTime: string,
  endTime: string
): Promise<UserAvailability[]> => {
  try {
    const { data, error } = await supabase
      .from('user_availability')
      .select('*')
      .eq('day_of_week', dayOfWeek);
    
    if (error) {
      console.error('Error fetching overlapping availability:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      return [];
    }

    // Transform the database items to application format
    const availabilitySlots: UserAvailability[] = data.map(item => 
      transformDbToUserAvailability(item as DbUserAvailability)
    );
    
    // Filter for overlapping slots
    const overlappingSlots = availabilitySlots.filter(slot => {
      // Convert times to minutes for easier comparison
      const requestStart = timeToMinutes(startTime);
      const requestEnd = timeToMinutes(endTime);
      const slotStart = timeToMinutes(slot.startTime);
      const slotEnd = timeToMinutes(slot.endTime);
      
      // Check if the slots overlap
      return (
        // Case 1: Requested slot starts during existing slot
        (requestStart >= slotStart && requestStart < slotEnd) ||
        // Case 2: Requested slot ends during existing slot
        (requestEnd > slotStart && requestEnd <= slotEnd) ||
        // Case 3: Requested slot completely contains existing slot
        (requestStart <= slotStart && requestEnd >= slotEnd)
      );
    });

    return overlappingSlots;
  } catch (error) {
    console.error('Unexpected error in fetchOverlappingAvailability:', error);
    return [];
  }
};

/**
 * Converts time string in HH:MM format to minutes
 */
const timeToMinutes = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours * 60) + minutes;
};
