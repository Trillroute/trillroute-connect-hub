
import { supabase } from '@/integrations/supabase/client';

/**
 * Create a new availability slot for a user
 */
export const createAvailabilitySlot = async (
  userId: string,
  dayOfWeek: number,
  startTime: string,
  endTime: string,
  category: string = 'Session'
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_availability')
      .insert({
        user_id: userId,
        day_of_week: dayOfWeek,
        start_time: startTime,
        end_time: endTime,
        category: category
      });
      
    if (error) {
      console.error('Error creating availability slot:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to create availability slot:', error);
    return false;
  }
};

/**
 * Update an existing availability slot
 */
export const updateAvailabilitySlot = async (
  id: string,
  startTime: string,
  endTime: string,
  category: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_availability')
      .update({
        start_time: startTime,
        end_time: endTime,
        category: category
      })
      .eq('id', id);
      
    if (error) {
      console.error('Error updating availability slot:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to update availability slot:', error);
    return false;
  }
};

/**
 * Delete an availability slot
 */
export const deleteAvailabilitySlot = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_availability')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting availability slot:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to delete availability slot:', error);
    return false;
  }
};
