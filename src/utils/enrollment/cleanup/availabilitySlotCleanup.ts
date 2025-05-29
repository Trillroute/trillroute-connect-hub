
import { supabase } from '@/integrations/supabase/client';

/**
 * Remove availability slot when it's used for a solo course enrollment
 */
export const removeUsedAvailabilitySlot = async (slotId: string): Promise<boolean> => {
  try {
    console.log('Removing used availability slot:', slotId);
    
    const { error } = await supabase
      .from('user_availability')
      .delete()
      .eq('id', slotId);

    if (error) {
      console.error('Error removing availability slot:', error);
      return false;
    }

    console.log('Successfully removed availability slot:', slotId);
    return true;
  } catch (error) {
    console.error('Error in removeUsedAvailabilitySlot:', error);
    return false;
  }
};

/**
 * Check if a slot is still available (not used by an enrollment)
 */
export const isSlotStillAvailable = async (slotId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('user_availability')
      .select('id')
      .eq('id', slotId)
      .single();

    if (error) {
      console.error('Error checking slot availability:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error in isSlotStillAvailable:', error);
    return false;
  }
};
