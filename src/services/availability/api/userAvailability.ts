
import { supabase } from '@/integrations/supabase/client';
import { UserAvailability } from '../types';
import { mapDbAvailabilitySlot } from './availabilityCore';

/**
 * Fetch user availability for a specific date
 */
export const fetchUserAvailabilityForDate = async (userId: string, date: Date): Promise<UserAvailability[]> => {
  try {
    // Get day of week (0 = Sunday, 1 = Monday, etc.)
    const dayOfWeek = date.getDay();
    
    const { data, error } = await supabase
      .from('user_availability')
      .select('*')
      .eq('user_id', userId)
      .eq('day_of_week', dayOfWeek);
      
    if (error) {
      console.error('Error fetching user availability:', error);
      throw error;
    }
    
    return data.map(slot => mapDbAvailabilitySlot(slot));
  } catch (error) {
    console.error('Failed to fetch availability for date:', error);
    return [];
  }
};

/**
 * Fetch user availability for the entire week
 */
export const fetchUserAvailabilityForWeek = async (userId: string): Promise<UserAvailability[]> => {
  try {
    const { data, error } = await supabase
      .from('user_availability')
      .select('*')
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error fetching user weekly availability:', error);
      throw error;
    }
    
    return data.map(slot => mapDbAvailabilitySlot(slot));
  } catch (error) {
    console.error('Failed to fetch weekly availability:', error);
    return [];
  }
};

/**
 * Fetch all availability slots for a user
 */
export const fetchUserAvailability = async (userId: string): Promise<UserAvailability[]> => {
  try {
    const { data, error } = await supabase
      .from('user_availability')
      .select('*')
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error fetching user availability:', error);
      throw error;
    }
    
    return data.map(slot => mapDbAvailabilitySlot(slot));
  } catch (error) {
    console.error('Failed to fetch availability:', error);
    return [];
  }
};
