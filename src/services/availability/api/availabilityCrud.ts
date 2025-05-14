
import { supabase } from '@/integrations/supabase/client';
import { UserAvailability } from '../types';
import { mapDbAvailabilitySlot } from './userAvailability';

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
    const { data, error } = await supabase
      .from('user_availability')
      .insert({
        user_id: userId,
        day_of_week: dayOfWeek,
        start_time: startTime,
        end_time: endTime,
        category: category
      })
      .select();
      
    if (error) {
      console.error('Error creating availability slot:', error);
      return false;
    }
    
    return !!data && data.length > 0;
  } catch (error) {
    console.error('Error in createAvailabilitySlot:', error);
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
  category?: string
): Promise<boolean> => {
  try {
    const updateData: Partial<UserAvailability> = {
      startTime,
      endTime
    };
    
    if (category) {
      updateData.category = category;
    }
    
    // Convert to database column names
    const dbUpdateData = {
      start_time: updateData.startTime,
      end_time: updateData.endTime
    };
    
    if (updateData.category) {
      dbUpdateData['category'] = updateData.category;
    }
    
    const { error } = await supabase
      .from('user_availability')
      .update(dbUpdateData)
      .eq('id', id);
      
    if (error) {
      console.error('Error updating availability slot:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateAvailabilitySlot:', error);
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
    console.error('Error in deleteAvailabilitySlot:', error);
    return false;
  }
};
