
import { supabase } from '@/integrations/supabase/client';

/**
 * Check if a slot is still available for booking
 * 
 * @param slotId The ID of the availability slot to check
 * @returns True if the slot is available, false otherwise
 */
export const checkSlotAvailability = async (slotId: string): Promise<boolean> => {
  try {
    // Use RPC function to check slot availability
    // If there's no RPC function, we need to query the user_events table
    const { data, error } = await supabase
      .from("user_events")
      .select("*")
      .eq("id", slotId)
      .single();
    
    if (error) {
      console.error('Error checking slot availability:', error);
      return false;
    }
    
    // Check if the event exists and is not already booked
    // Safely access the metadata field and check is_booked property
    const metadata = data?.metadata;
    if (typeof metadata === 'object' && metadata !== null) {
      // Check if metadata has is_booked property and it's true
      return !((metadata as Record<string, unknown>).is_booked === true);
    }
    
    // If metadata isn't an object or doesn't have is_booked, assume it's available
    return true;
  } catch (error) {
    console.error('Error in checkSlotAvailability:', error);
    return false;
  }
};
