
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
    const { data, error } = await supabase
      .rpc('check_slot_availability', { slot_id: slotId });
    
    if (error) {
      console.error('Error checking slot availability:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error in checkSlotAvailability:', error);
    return false;
  }
};
